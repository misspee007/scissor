import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Url } from '@prisma/client';
import * as crypto from 'crypto';
import * as QrCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async shortenUrl(data: ShortenUrlDto, userId: number): Promise<string> {
    try {
      // check if url has already been shortened
      const existingUrl = await this.prisma.url.findFirst({
        where: {
          longUrl: data.longUrl,
        },
      });

      if (existingUrl) {
        return existingUrl.shortUrl;
      }

      const uniqueId = this.generateUniqueIdentifier();

      const newUrl = await this.prisma.url.create({
        data: {
          longUrl: data.longUrl,
          shortUrlId: uniqueId,
          shortUrl: `${this.configService.get<string>('APP_URL')}/${uniqueId}`,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return newUrl.shortUrl;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async redirect(shortUrlId: string): Promise<string> {
    try {
      if (!shortUrlId) {
        throw new NotFoundException('Resource not found');
      }

      const url = await this.prisma.url.findUnique({
        where: {
          shortUrlId,
        },
      });

      return url.longUrl;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Resource not found');
    }
  }

  async createQrCode(
    shortUrlId: string,
  ): Promise<{ id: number; image: string; shortUrlId: string }> {
    const url = `${this.configService.get<string>('APP_URL')}/${shortUrlId}`;

    const existingUrl = await this.prisma.url.findUnique({
      where: {
        shortUrlId,
      },
      include: {
        qrCode: {
          select: {
            id: true,
            image: true,
          },
        },
      },
    });

    if (!existingUrl) {
      throw new NotFoundException('Url not found');
    }

    if (existingUrl.qrCode) {
      return {
        id: existingUrl.qrCode.id,
        image: existingUrl.qrCode.image,
        shortUrlId,
      };
    }

    const qrCode = await this.generateQrCode(url);
    const qrCodeUrl = await this.uploadFileToCdn(qrCode, shortUrlId);

    const updatedUrl = await this.prisma.url.update({
      where: {
        shortUrlId,
      },
      data: {
        qrCode: {
          create: {
            image: qrCodeUrl,
          },
        },
      },
      include: {
        qrCode: {
          select: {
            id: true,
            image: true,
          },
        },
      },
    });

    return {
      id: updatedUrl.qrCode.id,
      image: updatedUrl.qrCode.image,
      shortUrlId,
    };
  }

  async getUrl(shortUrlId: string): Promise<Url | null> {
    return this.prisma.url.findUnique({
      where: {
        shortUrlId,
      },
    });
  }

  async getUrlHistory(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UrlWhereUniqueInput;
      where?: Prisma.UrlWhereInput;
      orderBy?: Prisma.UrlOrderByWithRelationInput;
    },
    userId: number,
  ): Promise<{ urls: Url[]; count: number }> {
    const { skip, take, cursor, where, orderBy } = params;

    const parsedSkip = Number.isInteger(skip) ? skip : undefined;
    const parsedTake = Number.isInteger(take) ? take : undefined;

    const [urls, count] = await Promise.all([
      this.prisma.url.findMany({
        skip: parsedSkip,
        take: parsedTake,
        cursor,
        where: {
          ...where,
          userId,
        },
        orderBy,
        include: {
          qrCode: {
            select: {
              image: true,
            },
          },
        },
      }),
      this.prisma.url.count({
        where: {
          ...where,
          userId,
        },
      }),
    ]);

    return { urls, count };
  }

  async deleteUrl(where: Prisma.UrlWhereUniqueInput): Promise<Url> {
    const url = await this.prisma.url.findUnique({
      where,
      include: {
        qrCode: true,
        analytics: true,
      },
    });

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    // delete qr code
    if (url.qrCode) {
      await this.prisma.qrCode.delete({
        where: {
          urlId: url.id,
        },
      });
    }

    if (url.analytics) {
      const analyticsId = url.analytics.id;

      // delete click events
      await this.prisma.clickEvent.deleteMany({
        where: {
          analyticsId,
        },
      });

      // delete analytics
      await this.prisma.analytics.delete({
        where: {
          id: analyticsId,
        },
      });
    }

    return this.prisma.url.delete({
      where,
    });
  }

  generateUniqueIdentifier(): string {
    const randomBytes = crypto.randomBytes(4);
    const uniqueId = randomBytes.toString('hex');
    return uniqueId;
  }

  async generateQrCode(url: string): Promise<string> {
    const qrCode = await QrCode.toDataURL(url);
    return qrCode;
  }

  async uploadFileToCdn(file: string, id: string): Promise<string> {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    const publicId = `${this.configService.get<string>(
      'APP_NAME',
    )}/${this.configService.get<string>('APP_ENV')}/qrcodes/${id}`;

    const result = await cloudinary.uploader.upload(file, {
      public_id: publicId,
    });
    return result.secure_url;
  }
}

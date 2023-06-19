import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Url } from '@prisma/client';
import * as crypto from 'crypto';
import * as QrCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { ApiUnprocessableEntityResponse } from '@nestjs/swagger';

@Injectable()
export class UrlService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private baseUrl = this.configService.get<string>('BASE_URL');

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
          shortUrl: `${this.baseUrl}/${uniqueId}`,
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

  async createQrCode(shortUrlId: string): Promise<Url> {
    const id = shortUrlId.toString();
    const url = `${this.baseUrl}/${shortUrlId}`;
    const qrCode = await this.generateQrCode(url);

    const qrCodeUrl = await this.uploadFileToCdn(qrCode, id);

    const existingUrl = await this.prisma.url.findUnique({
      where: {
        shortUrlId: id,
      },
    });

    if (!existingUrl) {
      throw new NotFoundException('Url not found');
    }

    return this.prisma.url.update({
      where: {
        shortUrlId: id,
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
            image: true,
          },
        },
      },
    });
  }

  async url(
    urlWhereUniqueInput: Prisma.UrlWhereUniqueInput,
  ): Promise<Url | null> {
    return this.prisma.url.findUnique({
      where: urlWhereUniqueInput,
    });
  }

  async urls(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UrlWhereUniqueInput;
    where?: Prisma.UrlWhereInput;
    orderBy?: Prisma.UrlOrderByWithRelationInput;
  }): Promise<Url[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.url.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async updateUrl(params: {
    where: Prisma.UrlWhereUniqueInput;
    data: Prisma.UrlUpdateInput;
  }): Promise<Url> {
    const { where, data } = params;
    return this.prisma.url.update({
      data,
      where,
    });
  }

  async deleteUrl(where: Prisma.UrlWhereUniqueInput): Promise<Url> {
    return this.prisma.url.delete({
      where,
    });
  }

  private generateUniqueIdentifier(): string {
    const randomBytes = crypto.randomBytes(4);
    const uniqueId = randomBytes.toString('hex');
    return uniqueId;
  }

  private async generateQrCode(url: string): Promise<string> {
    const qrCode = await QrCode.toDataURL(url);
    return qrCode;
  }

  private async uploadFileToCdn(file: string, id: string): Promise<string> {
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

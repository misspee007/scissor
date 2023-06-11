import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Url } from '@prisma/client';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

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

  async shortenUrl(data: ShortenUrlDto, userId: number): Promise<Url> {
    const uniqueId = this.generateUniqueIdentifier();
    const baseUrl = this.configService.get<string>('BASE_URL');

    return this.prisma.url.create({
      data: {
        longUrl: data.longUrl,
        shortUrl: `${baseUrl}/${uniqueId}`,
        user: {
          connect: {
            id: userId,
          },
        },
      },
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
}

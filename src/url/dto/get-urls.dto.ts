import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

export class GetUserUrlsDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  @IsString({ message: 'User ID must be a string' })
  userId: string;
}

export class GetAllUrlsDto {
  @ApiPropertyOptional({
    description: 'Number of records to skip',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsString()
  skip?: string;

  @ApiPropertyOptional({
    description: 'Number of records to take',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsString()
  take?: string;

  @ApiPropertyOptional({
    description: 'Cursor for pagination',
    example: { id: 'exampleId' },
  })
  @IsOptional()
  @IsObject()
  cursor?: Prisma.UrlWhereUniqueInput;

  @ApiPropertyOptional({
    description: 'Filter for the URLs',
    example: { userId: 1 },
  })
  @IsOptional()
  @IsObject()
  where?: Prisma.UrlWhereInput;

  @ApiPropertyOptional({
    description: 'Order by criteria',
    example: { createdAt: 'desc' },
  })
  @IsOptional()
  @IsObject()
  orderBy?: Prisma.UrlOrderByWithRelationInput;
}

export class GetUrlDto {
  @ApiProperty({
    description: 'Short Url ID',
    example: '43b0f1c',
  })
  @IsString({ message: 'URL ID must be a string' })
  shortUrlId: string;
}

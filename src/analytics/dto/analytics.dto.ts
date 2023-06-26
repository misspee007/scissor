import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAnalyticsDto {
  shortUrlId: string;
  referer: string;
  userAgent: string;
  ipAddress: string;
  deviceType: string;
  clickCoordinates: string;
  timestamp: string;
}

export class GetAnalyticsDto {
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
  cursor?: Prisma.AnalyticsWhereUniqueInput;

  @ApiPropertyOptional({
    description: 'Filter for the Analytics',
    example: { userId: 1 },
  })
  @IsOptional()
  @IsObject()
  where?: Prisma.AnalyticsWhereInput;

  @ApiPropertyOptional({
    description: 'Order by criteria',
    example: { createdAt: 'desc' },
  })
  @IsOptional()
  @IsObject()
  orderBy?: Prisma.AnalyticsOrderByWithRelationInput;
}

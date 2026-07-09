import { BadRequestException } from '@nestjs/common';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

export type PaginationOptions = {
  page: number;
  limit: number;
  skip: number;
  take: number;
};

export function getPaginationOptions(
  query?: PaginationQueryDto,
): PaginationOptions {
  const page = Number(query?.page ?? 1);
  const limit = Number(query?.limit ?? 10);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 50
  ) {
    throw new BadRequestException('Invalid pagination query parameters.');
  }

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  options: PaginationOptions,
): PaginatedResponseDto<T> {
  return {
    data,
    page: options.page,
    limit: options.limit,
    total,
    totalPages: Math.ceil(total / options.limit),
  };
}

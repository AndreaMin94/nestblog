import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArticleSummaryDto } from '../article/dto/article-summary.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(): Promise<CategoryDto[]> {
    return await this.categoryService.getAll();
  }

  @Get('slug/:slug/articles')
  async getPublishedArticlesBySlug(
    @Param('slug') slug: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ArticleSummaryDto>> {
    return await this.categoryService.getPublishedArticlesBySlug(slug, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
    return await this.categoryService.create(dto);
  }

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id', ParseIntPipe) id: number): Promise<CategoryDto> {
    return await this.categoryService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return await this.categoryService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.categoryService.delete(id);
  }
}

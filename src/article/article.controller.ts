import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleSummaryDto } from './dto/article-summary.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { ArticleDetailDto } from './dto/article-detail.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CreateArticleDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<ArticleSummaryDto> {
    return await this.articleService.create(dto, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyArticles(
    @CurrentUser() user: JwtPayload,
  ): Promise<ArticleSummaryDto[]> {
    return await this.articleService.getCurrentUserArticles(user.sub);
  }

  @Get()
  async getAll(): Promise<ArticleSummaryDto[]> {
    return await this.articleService.getAll();
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<ArticleDetailDto> {
    return this.articleService.getBySlug(slug);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleSummaryDto> {
    return await this.articleService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-publish')
  async togglePublishStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<ArticleSummaryDto> {
    return await this.articleService.togglePublishStatus(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<ArticleSummaryDto> {
    return await this.articleService.updateArticle(id, dto, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.articleService.deleteArticle(id, user.sub);
  }
}

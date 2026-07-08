import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleSummaryDto } from './dto/article-summary.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateArticleDto): Promise<ArticleSummaryDto> {
    return await this.articleService.create(dto);
  }
}

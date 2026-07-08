import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article';
import { In, Repository } from 'typeorm';
import { Category } from '../category/entities/category';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleSummaryDto } from './dto/article-summary.dto';
import { ArticleMapper } from './mappers/article.mapper';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateArticleDto): Promise<ArticleSummaryDto> {
    const title = dto.title.trim();
    const slug = this.generateSlug(title);
    const categoryIds = [...new Set(dto.categoryIds)];

    const existingArticle = await this.articleRepository.findOne({
      where: [{ title }, { slug }],
    });

    if (existingArticle) {
      throw new ConflictException(
        `Article with title "${title}" already exists.`,
      );
    }

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIds) },
    });

    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('One or more categories do not exist.');
    }

    const article = this.articleRepository.create({
      title,
      slug,
      content: dto.content.trim(),
      categories,
      is_published: dto.is_published ?? false,
    });

    const savedArticle = await this.articleRepository.save(article);

    return ArticleMapper.toSummaryDto(savedArticle);
  }

  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

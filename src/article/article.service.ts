import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article';
import { In, Repository } from 'typeorm';
import { Category } from '../category/entities/category';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleSummaryDto } from './dto/article-summary.dto';
import { ArticleMapper } from './mappers/article.mapper';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from '../auth/entities/user';
import { ArticleDetailDto } from './dto/article-detail.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateArticleDto,
    authorId: number,
  ): Promise<ArticleSummaryDto> {
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

    const author = await this.userRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new BadRequestException(`Author with ID ${authorId} not found.`);
    }
    const article = this.articleRepository.create({
      title,
      slug,
      content: dto.content.trim(),
      categories,
      is_published: dto.is_published ?? false,
      author: author,
    });

    const savedArticle = await this.articleRepository.save(article);

    return ArticleMapper.toSummaryDto(savedArticle);
  }

  async getAll(): Promise<ArticleSummaryDto[]> {
    const articles = await this.articleRepository.find({
      where: { is_published: true },
      relations: ['categories', 'author'],
    });

    return ArticleMapper.toSummaryDtoList(articles);
  }

  async getById(id: number): Promise<ArticleSummaryDto> {
    const article = await this.articleRepository.findOne({
      where: { id, is_published: true },
      relations: ['categories', 'author'],
    });

    if (!article) {
      throw new BadRequestException(`Article with ID ${id} not found.`);
    }

    return ArticleMapper.toSummaryDto(article);
  }

  async togglePublishStatus(
    id: number,
    authorId: number,
  ): Promise<ArticleSummaryDto> {
    const existingArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ['categories', 'author'],
    });

    if (!existingArticle) {
      throw new BadRequestException(`Article with ID ${id} not found.`);
    }

    if (existingArticle.author.id !== authorId) {
      throw new ForbiddenException('You cannot modify this article');
    }

    existingArticle.is_published = !existingArticle.is_published;

    const updatedArticle = await this.articleRepository.save(existingArticle);

    return ArticleMapper.toSummaryDto(updatedArticle);
  }

  async updateArticle(
    id: number,
    updateArticleDto: UpdateArticleDto,
    authorId: number,
  ): Promise<ArticleSummaryDto> {
    const existingArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ['categories', 'author'],
    });

    if (!existingArticle) {
      throw new BadRequestException(`Article with ID ${id} not found.`);
    }

    if (existingArticle.author.id !== authorId) {
      throw new ForbiddenException('You cannot modify this article');
    }

    if (
      await this.checkIfExistingArticleByTitleOrSlug(
        updateArticleDto.title,
        this.generateSlug(updateArticleDto.title),
      )
    ) {
      throw new ConflictException(
        `Article with title "${updateArticleDto.title}" already exists.`,
      );
    }

    const categoryIds = [...new Set(updateArticleDto.categoryIds)];

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIds) },
    });

    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('One or more categories do not exist.');
    }

    existingArticle.title = updateArticleDto.title.trim();
    existingArticle.slug = this.generateSlug(updateArticleDto.title);
    // existingArticle.content = updateArticleDto.content.trim();
    existingArticle.is_published =
      updateArticleDto.is_published ?? existingArticle.is_published;
    existingArticle.categories = categories;

    const updatedArticle = await this.articleRepository.save(existingArticle);

    return ArticleMapper.toSummaryDto(updatedArticle);
  }

  async deleteArticle(id: number, authorId: number) {
    const existingArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!existingArticle) {
      throw new BadRequestException(`Article with ID ${id} not found.`);
    }

    if (existingArticle.author.id !== authorId) {
      throw new ForbiddenException('You cannot delete this article');
    }

    await this.articleRepository.remove(existingArticle);
  }

  async getBySlug(slug: string): Promise<ArticleDetailDto> {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
        is_published: true,
      },
      relations: ['categories', 'author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found.`);
    }

    return ArticleMapper.toDetailDto(article);
  }

  async getCurrentUserArticles(authorId: number): Promise<ArticleSummaryDto[]> {
    const articles = await this.articleRepository.find({
      where: { author: { id: authorId } },
      relations: ['categories', 'author'],
    });

    return ArticleMapper.toSummaryDtoList(articles);
  }

  private async checkIfExistingArticleByTitleOrSlug(
    title: string,
    slug: string,
  ): Promise<boolean> {
    if (await this.articleRepository.countBy({ title, slug })) return true;
    return false;
  }

  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

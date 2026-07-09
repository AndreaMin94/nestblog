import { Category } from '../../category/entities/category';
import { ArticleSummaryDto } from '../dto/article-summary.dto';
import { Article } from '../entities/article';
import { CategoryArticleSummaryDto } from '../../category/dto/category-article-summary.dto';
import { ArticleDetailDto } from '../dto/article-detail.dto';

export class ArticleMapper {
  static toSummaryDto(article: Article): ArticleSummaryDto {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      is_published: article.is_published,
      categories:
        article.categories?.map((category) =>
          ArticleMapper.categoryToCategoryArticleSummary(category),
        ) || [],
      author: {
        id: article.author.id,
        email: article.author.email,
      },
      created_date: article.created_date,
    };
  }

  static toDetailDto(article: Article): ArticleDetailDto {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      is_published: article.is_published,
      categories:
        article.categories?.map((category) =>
          ArticleMapper.categoryToCategoryArticleSummary(category),
        ) || [],
      author: {
        id: article.author.id,
        email: article.author.email,
      },
      created_date: article.created_date,
    };
  }

  static toSummaryDtoList(articles: Article[]): ArticleSummaryDto[] {
    return articles.map((article) => ArticleMapper.toSummaryDto(article));
  }

  static categoryToCategoryArticleSummary(
    category: Category,
  ): CategoryArticleSummaryDto {
    return {
      id: category.id,
      name: category.name,
    };
  }
}

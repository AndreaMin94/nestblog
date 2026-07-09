import { Category } from '../../category/entities/category';
import { ArticleSummaryDto } from '../dto/article-summary.dto';
import { Article } from '../entities/article';
import { CategoryArticleSummaryDto } from '../../category/dto/category-article-summary.dto';

export class ArticleMapper {
  static toSummaryDto(article: Article): ArticleSummaryDto {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      categories:
        article.categories?.map((category) =>
          ArticleMapper.categoryToCategoryArticleSummary(category),
        ) || [],
      author: {
        id: article.author.id,
        email: article.author.email,
      },
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

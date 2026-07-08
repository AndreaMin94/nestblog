import { ArticleSummaryDto } from '../dto/article-summary.dto';
import { Article } from '../entities/article';

export class ArticleMapper {
  static toSummaryDto(article: Article): ArticleSummaryDto {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
    };
  }

  static toSummaryDtoList(articles: Article[]): ArticleSummaryDto[] {
    return articles.map((article) => this.toSummaryDto(article));
  }
}

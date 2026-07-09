import { CategoryArticleSummaryDto } from '../../category/dto/category-article-summary.dto';
import { AuthorSummaryDto } from './author-summary.dto';

export class ArticleSummaryDto {
  id!: number;
  title!: string;
  slug!: string;
  is_published!: boolean;
  categories!: CategoryArticleSummaryDto[];
  author!: AuthorSummaryDto;
}

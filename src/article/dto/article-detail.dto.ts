import { CategoryArticleSummaryDto } from 'src/category/dto/category-article-summary.dto';
import { AuthorSummaryDto } from './author-summary.dto';

export class ArticleDetailDto {
  id!: number;
  title!: string;
  slug!: string;
  content!: string;
  is_published!: boolean;
  categories!: CategoryArticleSummaryDto[];
  author!: AuthorSummaryDto;
  created_date!: Date;
}

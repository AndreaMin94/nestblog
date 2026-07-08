import { CategoryArticleSummaryDto } from 'src/category/dto/category-article-summary.dto';

export class ArticleSummaryDto {
  id!: number;
  title!: string;
  slug!: string;
  categories!: CategoryArticleSummaryDto[];
}

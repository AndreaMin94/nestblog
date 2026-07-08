import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ArticleSummaryDto } from '../../article/dto/article-summary.dto';

export class CategoryDto {
  @IsInt()
  id!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  slug!: string;

  @Type(() => ArticleSummaryDto)
  articles!: ArticleSummaryDto[];
}

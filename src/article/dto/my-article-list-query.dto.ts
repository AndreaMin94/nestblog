import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { ArticleListQueryDto } from './article-list-query.dto';

export class MyArticleListQueryDto extends ArticleListQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  is_published?: boolean;
}

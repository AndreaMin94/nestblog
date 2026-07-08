import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @MinLength(10, { message: 'Title must be at least 10 characters long' })
  title!: string;

  @MinLength(100, { message: 'Content must be at least 100 characters long' })
  content!: string;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one category is required' })
  @IsInt({ each: true })
  categoryIds!: number[];
}

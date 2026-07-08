import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateArticleDto {
  @MinLength(10, { message: 'Title must be at least 10 characters long' })
  title!: string;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one category is required' })
  @IsInt({ each: true })
  categoryIds!: number[];
}

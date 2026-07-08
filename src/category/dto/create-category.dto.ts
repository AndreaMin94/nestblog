import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name must not be empty' })
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  name!: string;
}

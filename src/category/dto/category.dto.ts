import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @IsInt()
  id!: number;

  @IsNotEmpty()
  @IsString()
  name!: string;
}

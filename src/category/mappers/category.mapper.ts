import { Category } from '../entities/category';
import { CategoryDto } from '../dto/category.dto';
import { ArticleMapper } from '../../article/mappers/article.mapper';

export class CategoryMapper {
  static toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      articles: ArticleMapper.toSummaryDtoList(category.articles ?? []),
    };
  }

  static toDtoList(categories: Category[]): CategoryDto[] {
    return categories.map((category) => this.toDto(category));
  }
}

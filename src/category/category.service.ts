import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { CategoryMapper } from './mappers/category.mapper';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CategoryDto> {
    const name = dto.name.trim();
    const slug = this.generateSlug(name);

    const existingCategory = await this.categoryRepository.findOne({
      where: [{ name }, { slug }],
    });

    if (existingCategory)
      throw new ConflictException(
        `Category with name "${name}" already exists.`,
      );

    const category = this.categoryRepository.create({
      name,
      slug,
      articles: [],
    });
    const savedCategory = await this.categoryRepository.save(category);

    return CategoryMapper.toDto(savedCategory);
  }

  async getById(id: number): Promise<CategoryDto> {
    const category = await this.getCategoryEntityById(id);

    return CategoryMapper.toDto(category);
  }

  async getAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find({
      relations: { articles: true },
    });

    return CategoryMapper.toDtoList(categories);
  }

  async update(id: number, dto: CreateCategoryDto): Promise<CategoryDto> {
    const category = await this.getCategoryEntityById(id);
    const name = dto.name.trim();
    const slug = this.generateSlug(name);

    if (category.name !== name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: [{ name }, { slug }],
      });

      if (existingCategory && existingCategory.id !== id)
        throw new ConflictException(
          `Category with name "${name}" already exists.`,
        );
    }

    category.name = name;
    category.slug = slug;

    const newCategory = await this.categoryRepository.save(category);

    return CategoryMapper.toDto(newCategory);
  }

  async delete(id: number): Promise<void> {
    const category = await this.getCategoryEntityById(id);

    await this.categoryRepository.remove(category);
  }

  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async getCategoryEntityById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { articles: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found.`);
    }

    return category;
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './entities/create-category.dto';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const name = dto.name.trim();
    const slug = this.generateSlug(name);

    const existingCategory = await this.categoryRepository.findOne({
      where: [{ name }, { slug }],
    });

    if (existingCategory)
      throw new ConflictException(
        `Category with name "${name}" already exists.`,
      );

    const category = this.categoryRepository.create({ name, slug });

    return this.categoryRepository.save(category);
  }

  async getById(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new ConflictException(`Category with ID "${id}" not found.`);
    }

    return this.toCategoryDto(category);
  }

  async getAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find();
    const categoriesDto = categories.map((category) =>
      this.toCategoryDto(category),
    );

    return categoriesDto;
  }

  async update(id: number, dto: CreateCategoryDto): Promise<CategoryDto> {
    const category = await this.getById(id);
    const name = dto.name.trim();
    const slug = this.generateSlug(name);

    if (category.name !== name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name },
      });

      if (existingCategory)
        throw new ConflictException(
          `Category with name "${name}" already exists.`,
        );
    }

    category.name = name;
    category.slug = slug;

    const newCategory = await this.categoryRepository.save(category);
    return this.toCategoryDto(newCategory);
  }

  async delete(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new ConflictException(`Category with ID "${id}" not found.`);
    }
    await this.categoryRepository.remove(category);
  }

  private generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private toCategoryDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }
}

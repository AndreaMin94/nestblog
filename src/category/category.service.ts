import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.dto';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './entities/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const name = dto.name.trim();

    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory)
      throw new ConflictException(
        `Category with name "${name}" already exists.`,
      );

    const category = this.categoryRepository.create({ name });

    return this.categoryRepository.save(category);
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new ConflictException(`Category with ID "${id}" not found.`);
    }

    return category;
  }

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async update(id: number, dto: CreateCategoryDto): Promise<Category> {
    console.log('Updating category with ID:', id, 'and DTO:', dto);
    const category = await this.getById(id);
    const name = dto.name.trim();

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

    return this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<void> {
    const category = await this.getById(id);
    await this.categoryRepository.remove(category);
  }
}

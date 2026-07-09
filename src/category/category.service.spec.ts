import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category';
import { Article } from '../article/entities/article';

describe('CategoryService', () => {
  let service: CategoryService;
  const categoryRepositoryMock = {};
  const articleRepositoryMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepositoryMock,
        },
        {
          provide: getRepositoryToken(Article),
          useValue: articleRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

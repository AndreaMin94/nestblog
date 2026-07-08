import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article';
import { Category } from '../category/entities/category';

describe('ArticleService', () => {
  let service: ArticleService;
  const articleRepositoryMock = {};
  const categoryRepositoryMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: articleRepositoryMock,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

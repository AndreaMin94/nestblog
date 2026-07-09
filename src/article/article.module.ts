import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article';
import { Category } from '../category/entities/category';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, User]), AuthModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}

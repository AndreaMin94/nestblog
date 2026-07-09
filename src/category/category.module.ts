import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category';
import { AuthModule } from '../auth/auth.module';
import { Article } from '../article/entities/article';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Article]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

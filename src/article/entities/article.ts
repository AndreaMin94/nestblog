import { MinLength } from 'class-validator';
import { Category } from '../../category/entities/category';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @MinLength(10, { message: 'Title must be at least 10 characters long' })
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column('boolean', { default: false })
  is_published!: boolean;

  @Column('text')
  @MinLength(100, { message: 'Content must be at least 100 characters long' })
  content!: string;

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable({
    name: 'articles_categories',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories!: Category[];

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

  @ManyToOne(() => User, (user) => user.articles, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  author!: User;
}

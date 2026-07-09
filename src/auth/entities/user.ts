import { Article } from 'src/article/entities/article';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @CreateDateColumn()
  created_date!: Date;

  @UpdateDateColumn()
  updated_date!: Date;

  @OneToMany(() => Article, (article) => article.author)
  articles!: Article[];
}

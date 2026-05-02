import { Author } from './author.interface';
import { Category } from './category.interface';

export interface Pasodoble {
  id: number;
  title: string;
  author_id: number;
  category_id: number;
  description: string;
  pdf_url: string; 
  year: Date;
  category: Category;
  author?: Author;
}
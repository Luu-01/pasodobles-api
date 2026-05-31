import { Author } from '../../authors/models/author.interface';
import { PaginatedResponse } from '../../../shared/models/pagination.interface';
import { Category } from './category.interface';

export interface Pasodoble {
  id: number;
  title: string;
  year?: number | null;
  description?: string | null;
  pdf_url?: string | null;
  
  // id's
  author_id?: number | null;
  category_id?: number | null;
  
  //~ objects
  author?: Author | null;
  category?: Category | null;
  
  is_favorite?: boolean;
}

export interface FavoriteToggleResponse {
  message: string;
  is_favorite: boolean;
  pasodoble_id: number;
}

export type PasodoblesResponse = PaginatedResponse<Pasodoble>;
export type FavoritesResponse = PaginatedResponse<Pasodoble>;

import { PaginatedResponse } from '../../../shared/models/pagination.interface';

export interface Author {
    id: number;
    name: string;
    biography?: string | null;
    birth_year?: number | null;
    image_url?: string | null;
}

export type AuthorsResponse = PaginatedResponse<Author>;

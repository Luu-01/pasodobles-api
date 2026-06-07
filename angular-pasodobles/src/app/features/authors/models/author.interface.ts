import { PaginatedResponse } from '../../../shared/models/pagination.interface';
import { Pasodoble } from '../../pasodobles/models/pasodoble.interface';

export interface Author {
    id: number;
    name: string;
    biography?: string | null;
    birth_year?: number | null;
    image_url?: string | null;
    pasodobles?: [Pasodoble];
}

export type AuthorsResponse = PaginatedResponse<Author>;

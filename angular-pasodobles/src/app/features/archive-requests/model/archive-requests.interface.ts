import { User } from "../../users/models/user.interface";

export interface RequestPasodoblePayload{

    // all optional since not every data is always sent from the form

    title?: string;
    description?: string;
    year?: number | string;
    pdf_url?: string | null;
    author_id?: number | string | null;
    category_id?: number | string | null;

    reason?: string; // added user reason field
}

export interface ArchiveRequests {
  id: number;
  user_id: number;

  target_type: 'pasodoble' | 'author';
  target_id: number | null;
  action: 'create' | 'edit' | 'delete';
  payload?: RequestPasodoblePayload | null;

  status: 'pending' | 'approved' | 'rejected';

  reviewed_by?: number | null;
  admin_reason?: string | null;
  reviewed_at?: string | null;

  created_at?: string;
  updated_at?: string;

  user?: ArchiveRequestUser;
  reviewer?: ArchiveRequestUser | null;
}

export interface ArchiveRequestsResponse {
  data: ArchiveRequests[];
}

export interface ArchiveRequestUser {
  id: number;
  name: string;
  email: string;
}
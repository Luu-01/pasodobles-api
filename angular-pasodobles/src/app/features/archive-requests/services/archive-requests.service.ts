import { inject, Injectable } from "@angular/core";
import { ArchiveRequests, ArchiveRequestsResponse, RequestAuthorPayload, RequestPasodoblePayload } from "../model/archive-requests.interface";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../../../auth/auth.service";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ArchiveRequestsService{

    private apiUrl = environment.apiUrl
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    getArchiveRequests(): Observable<{data: ArchiveRequests[] }>{
        return this.http.get<{data: ArchiveRequests[] }>(`${this.apiUrl}/archive-requests`, this.authService.getAuthHeaders());
    }

    getArchiveRequest(id: string | null): Observable<{data: ArchiveRequests}>{
        return this.http.get<{data: ArchiveRequests}>(`${this.apiUrl}/archive-requests/${id}`, this.authService.getAuthHeaders());
    }

    getAdminArchiveRequests(): Observable<{data: ArchiveRequests[]}>{
        return this.http.get<{data: ArchiveRequests[] }>(`${this.apiUrl}/admin/archive-requests`, this.authService.getAuthHeaders());
    }

    approveArchiveRequest(id: number, admin_reason: string): Observable<ArchiveRequests>{
        return this.http.post<ArchiveRequests>(
            `${this.apiUrl}/admin/archive-requests/${id}/approve`,
            admin_reason,
            this.authService.getAuthHeaders()
        );
    }

    rejectArchiveRequest(id: number, admin_reason: string): Observable<ArchiveRequests>{
        return this.http.post<ArchiveRequests>(
            `${this.apiUrl}/admin/archive-requests/${id}/reject`,
            admin_reason,
            this.authService.getAuthHeaders()
        );
    }

    createArchiveRequest(payload: Pick<ArchiveRequests, 'target_type' | 'target_id' | 'action' | 'payload'>): Observable<ArchiveRequestsResponse> {
        return this.http.post<ArchiveRequestsResponse>(
            `${this.apiUrl}/archive-requests`,
            payload,
            this.authService.getAuthHeaders()
        );
        }

}
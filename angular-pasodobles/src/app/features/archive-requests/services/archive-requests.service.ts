import { inject, Injectable } from "@angular/core";
import { ArchiveRequests, ArchiveRequestsResponse } from "../model/archive-requests.interface";
import { HttpClient, HttpParams } from "@angular/common/http";
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

    getArchiveRequests(page = 1): Observable<ArchiveRequestsResponse>{
        const params = new HttpParams().set('page', page);
        return this.http.get<ArchiveRequestsResponse>(`${this.apiUrl}/archive-requests`, { ...this.authService.getAuthHeaders(), params });
    }

    getArchiveRequest(id: string | null): Observable<{data: ArchiveRequests}>{
        return this.http.get<{data: ArchiveRequests}>(`${this.apiUrl}/archive-requests/${id}`, this.authService.getAuthHeaders());
    }

    getAdminArchiveRequests(page = 1): Observable<ArchiveRequestsResponse>{
        const params = new HttpParams().set('page', page);
        return this.http.get<ArchiveRequestsResponse>(`${this.apiUrl}/admin/archive-requests`, { ...this.authService.getAuthHeaders(), params });
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

    createArchiveRequest(payload: Pick<ArchiveRequests, 'target_type' | 'target_id' | 'action' | 'payload'>): Observable<{data: ArchiveRequests}> {
        return this.http.post<{data: ArchiveRequests}>(
            `${this.apiUrl}/archive-requests`,
            payload,
            this.authService.getAuthHeaders()
        );
        }

}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import {
  DeleteRehearsalResponse,
  Rehearsal,
  RehearsalAttendancesResponse,
  RehearsalCollectionResponse,
  RehearsalMutationResponse,
  RehearsalPayload,
  RehearsalResponse,
  SetRehearsalAttendancePayload,
} from '../models/rehearsal.interface';

@Injectable({
  providedIn: 'root',
})
export class RehearsalService {
  private readonly apiUrl = 'http://pasodobles.mb/api';

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getRehearsals(): Observable<RehearsalCollectionResponse> {
    return this.http.get<RehearsalCollectionResponse>(
      `${this.apiUrl}/rehearsals`,
      this.authService.getAuthHeaders()
    );
  }

  getRehearsal(id: number | string): Observable<RehearsalResponse> {
    return this.http.get<RehearsalResponse>(
      `${this.apiUrl}/rehearsals/${id}`,
      this.authService.getAuthHeaders()
    );
  }

  createRehearsal(payload: RehearsalPayload): Observable<RehearsalMutationResponse> {
    return this.http.post<RehearsalMutationResponse>(
      `${this.apiUrl}/admin/rehearsals`,
      payload,
      this.authService.getAuthHeaders()
    );
  }

  updateRehearsal(
    id: number | string,
    payload: Partial<RehearsalPayload>
  ): Observable<RehearsalMutationResponse> {
    return this.http.put<RehearsalMutationResponse>(
      `${this.apiUrl}/admin/rehearsals/${id}`,
      payload,
      this.authService.getAuthHeaders()
    );
  }

  deleteRehearsal(id: number): Observable<DeleteRehearsalResponse> {
    return this.http.delete<DeleteRehearsalResponse>(
      `${this.apiUrl}/admin/rehearsals/${id}`,
      this.authService.getAuthHeaders()
    );
  }

  setAttendance(
    id: number,
    payload: SetRehearsalAttendancePayload
  ): Observable<RehearsalMutationResponse> {
    return this.http.post<RehearsalMutationResponse>(
      `${this.apiUrl}/rehearsals/${id}/attendance`,
      payload,
      this.authService.getAuthHeaders()
    );
  }

  getAdminAttendances(id: number): Observable<RehearsalAttendancesResponse> {
    return this.http.get<RehearsalAttendancesResponse>(
      `${this.apiUrl}/admin/rehearsals/${id}/attendances`,
      this.authService.getAuthHeaders()
    );
  }
}
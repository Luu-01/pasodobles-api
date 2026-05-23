import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // SSR
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../features/users/models/user.interface';

// Using BehaviorSubject and ServerSideRendering protection to prevent early localStorage access

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://pasodobles.mb/api/auth'; 
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private headers = new HttpHeaders({
    'Accept': 'application/json'
  });

  // BehaviorSubject
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, this.getAuthHeaders()).pipe(
      tap((user) => {
        this.saveUser(user);   
      })
    );
  }
  
  // avoid window reload session loss
  private loadStoredUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers: this.headers }).pipe(
      tap((response: any) => {
        this.saveToken(response.access_token);
        this.saveUser(response.user)
        
        this.currentUserSubject.next(response.user); // Update BehaviorSubject
      })
    );
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData, { headers: this.headers }).pipe(
      tap((response: any) => {
        this.saveToken(response.access_token);
        this.saveUser(response.user);

        this.currentUserSubject.next(response.user); // Update BehaviorSubject
      }), 
    );
  }

  logout() { 

    let token = '';
    if(isPlatformBrowser(this.platformId)){ 
      token = localStorage.getItem('auth_token') || '';
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': `application/json`
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        this.cleanSession();
      })
    );
  }

  // SSR protected saving methods
  private saveToken(token: string) {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_token', token);
    }
  }

  private saveUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  getToken(){
    let token = '';
    if(isPlatformBrowser(this.platformId)){ // SSR Protecting
      token = localStorage.getItem('auth_token') || '';
    }
    return token;
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    let token = this.getToken();
    if(isPlatformBrowser(this.platformId)){ // SSR Protecting
        token = localStorage.getItem('auth_token') || '';
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }),
    };
  }

  getCurrentUser(): User | null | any{
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }
    return this.currentUserSubject.value;
  }

  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }
    return this.currentUserSubject.value?.role ?? null;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean | any {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }
    return this.getToken() !== '';
  }

  cleanSession(){
    if(isPlatformBrowser(this.platformId)){  // SSR Protecting
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

}
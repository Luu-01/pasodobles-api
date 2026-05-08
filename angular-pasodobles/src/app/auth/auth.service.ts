import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // SSR
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';


// Using BehaviorSubject and ServerSideRendering protection to prevent early localStorage access

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

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
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if(isPlatformBrowser(this.platformId)){ 
      if (localStorage.getItem('auth_token')) {
        this.getUser().subscribe();
      }
    }
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers: this.headers }).pipe(
      tap((response: any) => {
        console.log(response.user)
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

  // SSR protected saving methods
  private saveToken(token: string) {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_token', token);
    }
  }

  private saveUser(user: any){
    if(isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(){

    let token = '';
    if(isPlatformBrowser(this.platformId)){ // SSR Protecting
      token = localStorage.getItem('auth_token') || '';
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/user`, { headers }).pipe(
      tap(user => {
        this.currentUserSubject.next(user); // Update BehaviorSubject
      })
    );
  }

  logout() {
    if(isPlatformBrowser(this.platformId)){ // SSR Protecting
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['auth/login']).then(() => {
      window.location.reload();
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, {}).subscribe();
  }
}
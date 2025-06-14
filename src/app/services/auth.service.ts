import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; // Altere se sua porta for diferente

  constructor(private http: HttpClient) {}

  // Login (POST: /auth/login)
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Cadastro (POST: /auth/register)
  register(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, credentials);
  }
}

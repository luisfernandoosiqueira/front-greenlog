import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Motorista {
  cpf: string;
  nome: string;
  dataNascimento: string; // ISO string, ex: '1990-05-10'
}

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private baseUrl = 'http://localhost:8080/motoristas';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.baseUrl);
  }

  buscarPorCpf(cpf: string): Observable<Motorista> {
    return this.http.get<Motorista>(`${this.baseUrl}/${cpf}`);
  }

  adicionar(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(this.baseUrl, motorista);
  }

  atualizar(cpf: string, motorista: Motorista): Observable<Motorista> {
    return this.http.put<Motorista>(`${this.baseUrl}/${cpf}`, motorista);
  }

  excluir(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${cpf}`);
  }
}
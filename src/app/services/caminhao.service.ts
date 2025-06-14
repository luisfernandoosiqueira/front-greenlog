import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Caminhao {
    placa: string;
    motorista: Motorista | null; 
    tipoResiduo: string[];
  }

export interface Motorista {
    cpf: string;
    nome: string;
    dataNascimento: string; // ISO date string
}

@Injectable({
  providedIn: 'root',
})
export class CaminhaoService {
    private baseUrl = 'http://localhost:8080/caminhoes';

    constructor(private http: HttpClient) {}

    listarTodos(): Observable<Caminhao[]> {
        return this.http.get<Caminhao[]>(this.baseUrl);
    }

    criar(caminhao: Caminhao): Observable<any> {
        return this.http.post(this.baseUrl, caminhao);
    }

    atualizar(caminhao: Caminhao): Observable<any> {
        return this.http.put(`${this.baseUrl}/${caminhao.placa}`, caminhao);
    }

    excluir(placa: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${placa}`);
    }

    buscarPorPlaca(placa: string): Observable<Caminhao> {
        return this.http.get<Caminhao>(`${this.baseUrl}/${placa}`);
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bairro {
  id: number;
  nomeBairro: string;
}

export interface BairroCreate {
  nomeBairro: string;
}

export interface RuaConexao {
  id?: number;
  bairroOrigem: Bairro;
  bairroDestino: Bairro;
  distanciaKm: number;
}

@Injectable({
  providedIn: 'root'
})
export class BairroService {
  private baseUrl = 'http://localhost:8080/api';
  private bairrosUrl = `${this.baseUrl}/bairros`;
  private conexoesUrl = `${this.baseUrl}/ruas-conexoes`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Bairro[]> {
    return this.http.get<Bairro[]>(this.bairrosUrl);
  }

  buscarPorId(id: number): Observable<Bairro> {
    return this.http.get<Bairro>(`${this.bairrosUrl}/${id}`);
  }

  salvar(bairro: Bairro | BairroCreate): Observable<Bairro> {
    if ('id' in bairro) {
      // Atualização (PUT)
      return this.http.put<Bairro>(`${this.bairrosUrl}/${bairro.id}`, bairro);
    } else {
      // Criação (POST)
      return this.http.post<Bairro>(this.bairrosUrl, bairro);
    }
  }  

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.bairrosUrl}/${id}`);
  }

  listarConexoesPorBairro(bairroId: number): Observable<RuaConexao[]> {
    return this.http.get<RuaConexao[]>(`${this.conexoesUrl}/bairro/${bairroId}`);
  }

  buscarConexao(id: number): Observable<RuaConexao> {
    return this.http.get<RuaConexao>(`${this.conexoesUrl}/${id}`);
  }

  salvarConexao(conexao: RuaConexao): Observable<RuaConexao> {
    if (conexao.id) {
      return this.http.put<RuaConexao>(`${this.conexoesUrl}/${conexao.id}`, conexao);
    }
    return this.http.post<RuaConexao>(this.conexoesUrl, conexao);
  }

  excluirConexao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.conexoesUrl}/${id}`);
  }

  listarPorTipoResiduo(tipoResiduo: string): Observable<Bairro[]> {
    return this.http.get<Bairro[]>(`${this.bairrosUrl}/por-tipo-residuo/${tipoResiduo}`);
  }
  
}
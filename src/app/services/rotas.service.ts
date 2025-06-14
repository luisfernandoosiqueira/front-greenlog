import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Caminhao } from './caminhao.service';

export interface Bairro {
  id: number;
  nomeBairro: string;
}

export interface RuaConexao {
  id: number;
  bairroOrigem: Bairro;
  bairroDestino: Bairro;
  distanciaKm: number;
}

export interface Rota {
  id: number;
  nome: string;
  tipoResiduo: string;
  origem: Bairro | null;
  destino: Bairro | null;
  pesoTotal: number;
  caminhao: Caminhao | null;
  ruas: RuaConexao[];
  dataCriacao: string;
}

@Injectable({
  providedIn: 'root'
})
export class RotasService {
  private baseUrl = 'http://localhost:8080';
  private rotasUrl = `${this.baseUrl}/rotas`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Rota[]> {
    return this.http.get<Rota[]>(this.rotasUrl);
  }
  
  buscarPorId(id: number): Observable<Rota> {
    return this.http.get<Rota>(`${this.rotasUrl}/${id}`);
  }

  salvar(rota: Rota): Observable<Rota> {
    if (rota.id) {
      return this.http.put<Rota>(`${this.rotasUrl}/${rota.id}?nome=${rota.nome}`, rota);
    }
    return this.http.post<Rota>(this.rotasUrl, rota);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rotasUrl}/${id}`);
  }

  gerarRotaAutomatica(nome: string, origemId: number, destinoId: number, tipoResiduo: string, placaCaminhao: string): Observable<Rota> {
    const params = new HttpParams()
      .set('nome', nome)
      .set('origemId', origemId.toString())
      .set('destinoId', destinoId.toString())
      .set('tipoResiduo', tipoResiduo)
      .set('placaCaminhao', placaCaminhao);
  
    return this.http.post<Rota>(`${this.baseUrl}/rotas/rota-automatica`, null, { params });
  }  

  atualizar(rota: Rota): Observable<Rota> {
    return this.http.put<Rota>(`${this.rotasUrl}/${rota.id}`, rota);
  }  
}

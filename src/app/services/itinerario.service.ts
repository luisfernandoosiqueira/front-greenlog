// src/app/services/itinerario.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Caminhao { placa: string; }
export interface Bairro   { id: number; nomeBairro: string; }
export interface Rota {
  id?: number;
  nome: string;
  origem: Bairro | null;
  destino: Bairro | null;
  tipoResiduo: string;
  pesoTotal: number;
  dataCriacao: string;
  caminhao: Caminhao | null;
}
export interface Itinerario {
  id?: number;
  rota: Rota;
  dataAgendamento: string;
  distanciaTotal: number;
}

@Injectable({ providedIn: 'root' })
export class ItinerarioService {
  private baseUrl = 'http://localhost:8080/api/itinerarios';

  constructor(private http: HttpClient) {}

  /** Retorna todos os itinerários */
  listarTodos(): Observable<Itinerario[]> {
    return this.http.get<Itinerario[]>(this.baseUrl);
  }

  verificarCaminhaoNaData(placa: string, data: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/caminhao/${placa}/data/${data}`);
  }

  /** Filtra itinerários pela placa do caminhão */
  getByCaminhao(placa: string): Observable<Itinerario[]> {
    return this.http.get<Itinerario[]>(`${this.baseUrl}/caminhao/${placa}`);
  }

  /** Filtra itinerários por intervalo de datas */
  getByPeriodo(inicio: string, fim: string): Observable<Itinerario[]> {
    const params = new HttpParams().set('inicio', inicio).set('fim', fim);
    return this.http.get<Itinerario[]>(`${this.baseUrl}/periodo`, { params });
  }

  /** Filtra itinerários por placa e intervalo de datas */
  getByCaminhaoAndPeriodo(
    placa: string,
    inicio: string,
    fim: string
  ): Observable<Itinerario[]> {
    const params = new HttpParams().set('inicio', inicio).set('fim', fim);
    return this.http.get<Itinerario[]>(
      `${this.baseUrl}/caminhao/${placa}/periodo`,
      { params }
    );
  }

  /** Busca um único itinerário por ID */
  buscarPorId(id: number): Observable<Itinerario> {
    return this.http.get<Itinerario>(`${this.baseUrl}/${id}`);
  }

  /** Cria um novo itinerário */
  salvar(it: Itinerario): Observable<Itinerario> {
    return this.http.post<Itinerario>(this.baseUrl, it);
  }

  /** Atualiza um itinerário existente */
  atualizar(it: Itinerario): Observable<Itinerario> {
    return this.http.put<Itinerario>(`${this.baseUrl}/${it.id}`, it);
  }

  /** Exclui um itinerário por ID */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

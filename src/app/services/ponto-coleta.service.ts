import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PontoColeta {
  id?: number;
  bairro: { id: number; nomeBairro: string };
  nome: string;
  responsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  endereco: string;
  horarioFuncionamento: string;
  tiposResiduoAceitos: string;
}

@Injectable({
  providedIn: 'root'
})
export class PontoColetaService {
  private baseUrl = 'http://localhost:8080/api/pontos-coleta';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<PontoColeta[]> {
    return this.http.get<PontoColeta[]>(this.baseUrl);
  }

  salvar(ponto: PontoColeta): Observable<PontoColeta> {
    if (ponto.id) {
      return this.http.put<PontoColeta>(`${this.baseUrl}/${ponto.id}`, ponto);
    }
    return this.http.post<PontoColeta>(this.baseUrl, ponto);
  }

  // ✅ Adicione este método para corrigir o erro
  buscarPorId(id: number): Observable<PontoColeta> {
    return this.http.get<PontoColeta>(`${this.baseUrl}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }  

}

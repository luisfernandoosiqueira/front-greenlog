import { Injectable } from '@angular/core';
import { BairroService, Bairro, RuaConexao } from './bairro.service';
import { map, forkJoin, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RuasService {
  constructor(private bairroService: BairroService) {}

  /**
   * Retorna os vértices (nós) para o vis-network.
   */
  obterVertices(): Observable<any[]> {
    return this.bairroService.listarTodos().pipe(
      map((bairros: Bairro[]) =>
        bairros.map((bairro) => ({
          id: bairro.id,
          label: bairro.nomeBairro,
        }))
      )
    );
  }

  /**
   * Retorna as arestas (conexões) para o vis-network.
   */
  obterArestas(): Observable<any[]> {
    return this.bairroService.listarTodos().pipe(
      // Para cada bairro, buscamos suas conexões
      map((bairros: Bairro[]) => bairros.map((b) => b.id)),
      // Usamos forkJoin para esperar todas as requisições
      switchMap((ids: number[]) =>
        forkJoin(ids.map((id) => this.bairroService.listarConexoesPorBairro(id)))
      ),
      map((todasConexoes: RuaConexao[][]) => {
        const arestas: any[] = [];
        const adicionadas = new Set<string>();

        todasConexoes.forEach((conexoes) => {
          conexoes.forEach((conexao) => {
            const key = `${conexao.bairroOrigem.id}-${conexao.bairroDestino.id}`;
            const reverseKey = `${conexao.bairroDestino.id}-${conexao.bairroOrigem.id}`;
            if (!adicionadas.has(key) && !adicionadas.has(reverseKey)) {
              arestas.push({
                from: conexao.bairroOrigem.id,
                to: conexao.bairroDestino.id,
                label: `${conexao.distanciaKm} km`,
                arrows: 'to',
              });
              adicionadas.add(key);
            }
          });
        });

        return arestas;
      })
    );
  }

  /**
   * Retorna tanto os vértices quanto as arestas.
   */
  obterGrafo(): Observable<{ nodes: any[]; edges: any[] }> {
    return forkJoin({
      nodes: this.obterVertices(),
      edges: this.obterArestas(),
    });
  }
}

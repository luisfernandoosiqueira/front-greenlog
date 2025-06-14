import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { RotasService, Rota, RuaConexao } from '../../services/rotas.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-rotas-list',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterModule],
  templateUrl: './rotas-list.component.html',
  styleUrls: ['./rotas-list.component.scss'],
})
export class RotasListComponent implements OnInit {
  rotas: Rota[] = [];
  loading = false;
  expandedRowId: number | null = null;

  constructor(
    private rotasService: RotasService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.carregarRotas();
  }

  carregarRotas() {
    this.loading = true;
    this.rotasService.listarTodas().subscribe({
      next: (data) => {
        this.rotas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Erro ao carregar rotas.', 'Erro');
      },
    });
  }

  toggleRow(id: number) {
    this.expandedRowId = this.expandedRowId === id ? null : id;
  }

  getCaminhoFormatado(ruas: RuaConexao[]): string {
    if (!ruas || ruas.length === 0) {
      return 'Nenhum caminho disponível';
    }
    let path = ruas[0].bairroOrigem.nomeBairro;
    for (let i = 0; i < ruas.length; i++) {
      const distancia = ruas[i].distanciaKm ? ruas[i].distanciaKm.toFixed(1) : '0';
      const destino = ruas[i].bairroDestino.nomeBairro;
      path += ` -- ${distancia}km --> ${destino}`;
    }
    return path;
  }

  getImagemResiduo(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'organico':
        return 'assets/truck_organico.png';
      case 'plastico':
        return 'assets/truck_plastico.png';
      case 'metal':
        return 'assets/truck_metal.png';
      case 'papel':
        return 'assets/truck_papel.png';
      case 'vidro':
        return 'assets/truck_vidro.png';
      default:
        return 'assets/truck.png';
    }
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir esta rota?')) {
      this.rotasService.excluir(id).subscribe({
        next: () => {
          this.toastr.success('Rota excluída com sucesso!', 'Sucesso');
          this.carregarRotas();
        },
        error: () => {
          this.toastr.error('Erro ao excluir rota.', 'Erro');
        }
      });
    }
  }

  editar(id: number) {
    this.router.navigate(['/rotas/editar', id]);
  }

  adicionar() {
    this.router.navigate(['/rotas/novo']);
  }
}
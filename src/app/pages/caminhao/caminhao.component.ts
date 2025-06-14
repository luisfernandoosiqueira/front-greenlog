// src/app/pages/caminhao/caminhao.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterModule }      from '@angular/router';
import { CommonModule }      from '@angular/common';
import { ToastrService }     from 'ngx-toastr';

import { FooterComponent }          from '../../components/footer/footer.component';
import { Caminhao, CaminhaoService } from '../../services/caminhao.service';

@Component({
  selector: 'app-caminhao',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterModule],
  templateUrl: './caminhao.component.html',
  styleUrls: ['./caminhao.component.scss']
})
export class CaminhaoComponent implements OnInit {
  caminhoes: Caminhao[] = [];

  constructor(
    private caminhaoService: CaminhaoService,
    private toastr: ToastrService      // ← injeta ToastrService
  ) {}

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

  ngOnInit() {
    this.carregarCaminhoes();
  }

  carregarCaminhoes() {
    this.caminhaoService.listarTodos().subscribe({
      next: dados => {
        this.caminhoes = dados;
      },
      error: err => {
        console.error('Erro ao carregar caminhões:', err);
        this.toastr.error('Erro ao carregar caminhões.', 'Erro');
      }
    });
  }

  excluir(placa: string) {
    if (confirm('Tem certeza que deseja excluir este caminhão?')) {
      this.caminhaoService.excluir(placa).subscribe({
        next: () => {
          this.toastr.success('Caminhão excluído com sucesso!', 'Sucesso');
          this.carregarCaminhoes();
        },
        error: err => {
          console.error('Erro ao excluir caminhão:', err);
          this.toastr.error('Erro ao excluir o caminhão.', 'Erro');
        }
      });
    }
  }
}

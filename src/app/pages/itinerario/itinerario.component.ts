// src/app/pages/itinerario/itinerario.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { FooterComponent } from '../../components/footer/footer.component';
import { Itinerario, ItinerarioService } from '../../services/itinerario.service';
import { TipoResiduoService } from '../../services/tipoResiduo.service';
import { BairroService, Bairro } from '../../services/bairro.service';

@Component({
  selector: 'app-itinerario',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent, FormsModule],
  templateUrl: './itinerario.component.html',
  styleUrls: ['./itinerario.component.scss']
})
export class ItinerarioComponent implements OnInit {
  itinerarios: Itinerario[] = [];
  tiposResiduo: string[] = [];
  bairros: Bairro[] = [];
  loading = true;

  filtro = {
    placa: '',
    inicio: '',
    fim: '',
    tipoResiduo: '',
    bairro: null as Bairro | null
  };

  constructor(
    private itinerarioService: ItinerarioService,
    private tipoResiduoService: TipoResiduoService,
    private bairroService: BairroService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarTiposResiduo();
    this.carregarBairros();
    this.carregarItinerarios();
  }

  carregarTiposResiduo(): void {
    this.tipoResiduoService.listarTipos().subscribe({
      next: (tipos) => this.tiposResiduo = tipos,
      error: (err: any) => {
        console.error('Erro ao carregar tipos de resíduo', err);
        this.toastr.error('Erro ao carregar tipos de resíduo.', 'Erro');
      }
    });
  }

  carregarBairros(): void {
    this.bairroService.listarTodos().subscribe({
      next: (bairros) => this.bairros = bairros,
      error: (err: any) => {
        console.error('Erro ao carregar bairros', err);
        this.toastr.error('Erro ao carregar bairros.', 'Erro');
      }
    });
  }

  carregarItinerarios(): void {
    this.loading = true;
    this.itinerarioService.listarTodos().subscribe({
      next: (data) => {
        this.itinerarios = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar itinerários', err);
        this.loading = false;
        this.toastr.error('Erro ao carregar itinerários.', 'Erro');
      }
    });
  }

  filtrarItinerarios(): void {
    this.loading = true;
    this.itinerarioService.listarTodos().subscribe({
      next: (data) => {
        let resultado = data;

        if (this.filtro.placa) {
          resultado = resultado.filter(it =>
            it.rota.caminhao?.placa
              .toLowerCase()
              .includes(this.filtro.placa.toLowerCase())
          );
        }

        if (this.filtro.inicio && this.filtro.fim) {
          const dtInicio = new Date(this.filtro.inicio);
          const dtFim = new Date(this.filtro.fim);
          resultado = resultado.filter(it => {
            const dataAg = new Date(it.dataAgendamento);
            return dataAg >= dtInicio && dataAg <= dtFim;
          });
        }

        if (this.filtro.tipoResiduo) {
          resultado = resultado.filter(
            it => it.rota.tipoResiduo === this.filtro.tipoResiduo
          );
        }

        if (this.filtro.bairro) {
          const bairroNome = this.filtro.bairro.nomeBairro.toLowerCase();
          resultado = resultado.filter(
            it =>
              it.rota.origem?.nomeBairro
                .toLowerCase()
                .includes(bairroNome) ||
              it.rota.destino?.nomeBairro
                .toLowerCase()
                .includes(bairroNome)
          );
        }

        this.itinerarios = resultado;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao filtrar itinerários', err);
        this.loading = false;
        this.toastr.error('Erro ao filtrar itinerários.', 'Erro');
      }
    });
  }

  limparFiltro(): void {
    this.filtro = {
      placa: '',
      inicio: '',
      fim: '',
      tipoResiduo: '',
      bairro: null
    };
    this.carregarItinerarios();
  }

  // --- Métodos de ação:

  excluir(id: number): void {
    if (confirm('Deseja realmente excluir este itinerário?')) {
      this.itinerarioService.excluir(id).subscribe({
        next: () => {
          this.toastr.success('Itinerário excluído com sucesso!', 'Sucesso');
          this.carregarItinerarios();
        },
        error: (err: any) => {
          console.error('Erro ao excluir itinerário:', err);
          this.toastr.error('Erro ao excluir itinerário.', 'Erro');
        }
      });
    }
  }

  editar(id: number): void {
    this.router.navigate(['/relatorios/editar', id]);
  }

  adicionar(): void {
    this.router.navigate(['/relatorios/novo']);
  }
}

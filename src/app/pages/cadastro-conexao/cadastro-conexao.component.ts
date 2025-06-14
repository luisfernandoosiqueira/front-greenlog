// src/app/pages/cadastro-conexao/cadastro-conexao.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService }      from 'ngx-toastr';

import { BairroService, Bairro, RuaConexao } from '../../services/bairro.service';
import { FooterComponent }                   from '../../components/footer/footer.component';

@Component({
  selector: 'app-cadastro-conexao',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, RouterModule],
  templateUrl: './cadastro-conexao.component.html',
  styleUrls: ['./cadastro-conexao.component.scss']
})
export class CadastroConexaoComponent implements OnInit {
  bairroId: number | null = null;
  conexaoId: number | null = null;
  bairroOrigemNome: string = '';
  bairroDestinoId: number | null = null;
  distanciaKm: number | null = null;
  bairros: Bairro[] = [];

  constructor(
    private bairroService: BairroService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService    // ← injeta ToastrService
  ) {}

  ngOnInit() {
    this.bairroId = +this.route.snapshot.paramMap.get('id')!;
    this.conexaoId = this.route.snapshot.paramMap.get('conexaoId')
      ? +this.route.snapshot.paramMap.get('conexaoId')!
      : null;

    this.bairroService.buscarPorId(this.bairroId!).subscribe({
      next: (bairro: Bairro) => {
        this.bairroOrigemNome = bairro.nomeBairro;
      },
      error: (err: any) => {
        console.error('Erro ao buscar bairro origem:', err);
        this.toastr.error('Bairro não encontrado.', 'Erro');
        this.router.navigate(['/bairros']);
      }
    });

    this.bairroService.listarTodos().subscribe({
      next: (bairros: Bairro[]) => {
        this.bairros = bairros.filter(b => b.id !== this.bairroId);
      },
      error: (err: any) => {
        console.error('Erro ao buscar bairros:', err);
        this.toastr.error('Erro ao carregar bairros.', 'Erro');
      }
    });

    if (this.conexaoId) {
      this.bairroService.buscarConexao(this.conexaoId).subscribe({
        next: (conexao: RuaConexao) => {
          this.bairroDestinoId = conexao.bairroDestino.id;
          this.distanciaKm = conexao.distanciaKm;
        },
        error: (err: any) => {
          console.error('Erro ao buscar conexão:', err);
          this.toastr.error('Conexão não encontrada.', 'Erro');
          this.router.navigate(['/bairros/editar', this.bairroId]);
        }
      });
    }
  }

  get isFormValid(): boolean {
    return this.bairroDestinoId !== null
        && this.distanciaKm !== null
        && this.distanciaKm! > 0;
  }

  onSubmit() {
    if (!this.isFormValid) {
      this.toastr.warning('Por favor, preencha todos os campos corretamente.', 'Atenção');
      return;
    }

    const conexao: RuaConexao = {
      id: this.conexaoId ?? undefined,
      bairroOrigem: { id: this.bairroId!, nomeBairro: this.bairroOrigemNome },
      bairroDestino: { id: this.bairroDestinoId!, nomeBairro: '' },
      distanciaKm: this.distanciaKm!
    };

    this.bairroService.salvarConexao(conexao).subscribe({
      next: () => {
        this.toastr.success('Conexão salva com sucesso!', 'Sucesso');
        this.router.navigate(['/bairros/editar', this.bairroId]);
      },
      error: (err: any) => {
        console.error('Erro ao salvar conexão:', err);
        this.toastr.error('Erro ao salvar a conexão.', 'Erro');
      }
    });
  }

  cancelar() {
    this.toastr.info('Operação cancelada.', 'Cancelado');
    this.router.navigate(['/bairros/editar', this.bairroId]);
  }
}

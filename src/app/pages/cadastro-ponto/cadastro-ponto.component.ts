// src/app/pages/cadastro-ponto/cadastro-ponto.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BairroService } from '../../services/bairro.service';
import { TipoResiduoService } from '../../services/tipoResiduo.service';
import { PontoColetaService } from '../../services/ponto-coleta.service';
import { FooterComponent } from '../../components/footer/footer.component';

interface Bairro {
  id: number;
  nomeBairro: string;
}

interface PontoColeta {
  id?: number;
  bairro: Bairro;
  nome: string;
  responsavel: string;
  telefoneResponsavel: string;
  emailResponsavel: string;
  endereco: string;
  horarioFuncionamento: string;
  tiposResiduoAceitos: string;
}

@Component({
  selector: 'app-cadastro-ponto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './cadastro-ponto.component.html',
  styleUrls: ['./cadastro-ponto.component.scss']
})
export class CadastroPontoComponent implements OnInit {
  ponto: PontoColeta | null = null;
  bairros: Bairro[] = [];
  tiposResiduo: string[] = [];

  nome: string = '';
  bairroSelecionadoId: string = '';
  responsavel: string = '';
  telefoneResponsavel: string = '';
  emailResponsavel: string = '';
  endereco: string = '';
  horarioFuncionamento: string = '';
  tiposResiduoAceitos: string[] = [];

  constructor(
    private bairroService: BairroService,
    private tipoResiduoService: TipoResiduoService,
    private pontoService: PontoColetaService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService        // ← injeta ToastrService
  ) {}

  ngOnInit() {
    this.bairroService.listarTodos().subscribe(bairros => {
      this.bairros = bairros;

      this.tipoResiduoService.listarTipos().subscribe((tipos) => {
        this.tiposResiduo = tipos;
      });

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.pontoService.buscarPorId(+id).subscribe(ponto => {
          this.ponto = ponto;
          this.nome = ponto.nome;
          this.bairroSelecionadoId = ponto.bairro.id.toString();
          this.responsavel = ponto.responsavel;
          this.telefoneResponsavel = ponto.telefoneResponsavel;
          this.emailResponsavel = ponto.emailResponsavel;
          this.endereco = ponto.endereco;
          this.horarioFuncionamento = ponto.horarioFuncionamento;
          this.tiposResiduoAceitos = ponto.tiposResiduoAceitos
            .split(',')
            .map(r => r.trim());
        });
      }
    });
  }

  get isFormValid(): boolean {
    return (
      this.nome.trim() !== '' &&
      this.bairroSelecionadoId.trim() !== '' &&
      this.tiposResiduoAceitos.length > 0
    );
  }

  toggleResiduo(residuo: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.tiposResiduoAceitos.push(residuo);
    } else {
      this.tiposResiduoAceitos = this.tiposResiduoAceitos.filter(r => r !== residuo);
    }
  }

  onSubmit() {
    if (!this.isFormValid) {
      this.toastr.warning(
        'Por favor, preencha todos os campos obrigatórios (Nome, Bairro e pelo menos um Tipo de Resíduo).',
        'Atenção'
      );
      return;
    }

    const bairroObj = this.bairros.find(b => b.id === +this.bairroSelecionadoId);
    if (!bairroObj) {
      this.toastr.error('Bairro inválido!', 'Erro');
      return;
    }

    const ponto: PontoColeta = {
      id: this.ponto?.id,
      nome: this.nome,
      bairro: bairroObj,
      responsavel: this.responsavel,
      telefoneResponsavel: this.telefoneResponsavel,
      emailResponsavel: this.emailResponsavel,
      endereco: this.endereco,
      horarioFuncionamento: this.horarioFuncionamento,
      tiposResiduoAceitos: this.tiposResiduoAceitos.join(', ')
    };

    this.pontoService.salvar(ponto).subscribe({
      next: () => {
        this.toastr.success('Ponto de coleta salvo com sucesso!', 'Sucesso');
        this.router.navigate(['/bairros']);
      },
      error: err => {
        console.error('Erro ao salvar ponto de coleta:', err);
        this.toastr.error(
          'Erro ao salvar ponto de coleta: ' + err.message,
          'Erro'
        );
      }
    });
  }

  cancelar() {
    this.toastr.info('Operação cancelada.', 'Cancelado');
    this.router.navigate(['/bairros']);
  }
}

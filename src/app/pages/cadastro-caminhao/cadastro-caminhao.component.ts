// src/app/pages/cadastro-caminhao/cadastro-caminhao.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService }     from 'ngx-toastr';

import { MotoristaService }   from '../../services/motorista.service';
import { TipoResiduoService } from '../../services/tipoResiduo.service';
import { CaminhaoService, Caminhao } from '../../services/caminhao.service';
import { FooterComponent }    from '../../components/footer/footer.component';

interface Motorista {
  cpf: string;
  nome: string;
  dataNascimento: string;
}

@Component({
  selector: 'app-cadastro-caminhao',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, RouterModule],
  templateUrl: './cadastro-caminhao.component.html',
  styleUrls: ['./cadastro-caminhao.component.scss']
})
export class CadastroCaminhaoComponent implements OnInit {
  caminhao: Caminhao | null = null;
  placasExistentes: string[] = [];
  motoristas: Motorista[] = [];
  placa: string = '';
  motoristaSelecionadoCpf: string = '';
  tiposResiduo: string[] = [];
  tiposResiduosSelecionados: string[] = [];
  mensagemErro: string = '';

  constructor(
    private motoristaService: MotoristaService,
    private tipoResiduoService: TipoResiduoService,
    private caminhaoService: CaminhaoService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService    // ← injeta ToastrService
  ) {}

  ngOnInit() {
    this.motoristaService.listarTodos().subscribe(motoristas => {
      this.motoristas = motoristas;
    });

    this.carregarTiposResiduo();
    

    this.caminhaoService.listarTodos().subscribe(caminhoes => {
      this.placasExistentes = caminhoes.map(c => c.placa);
    });

    const placaParam = this.route.snapshot.paramMap.get('placa');
    if (placaParam) {
      this.caminhaoService.buscarPorPlaca(placaParam).subscribe({
        next: cam => {
          this.caminhao = cam;
          this.placa = cam.placa;
          this.motoristaSelecionadoCpf = cam.motorista?.cpf ?? '';
          this.tiposResiduosSelecionados = Array.isArray(cam.tipoResiduo)
            ? cam.tipoResiduo
            : [cam.tipoResiduo];
        },
        error: () => {
          this.toastr.error('Caminhão não encontrado.', 'Erro');
          setTimeout(() => this.router.navigate(['/caminhoes']), 3000);
        }
      });
    }
  }

  get isFormValid(): boolean {
    return (
      this.placa.trim().length === 7 &&
      this.tiposResiduosSelecionados.length > 0
    );
  }

  carregarTiposResiduo() {
    this.tipoResiduoService.listarTipos().subscribe((tipos) => {
      this.tiposResiduo = tipos;
    });
  }

  toggleResiduo(residuo: string) {
    const idx = this.tiposResiduosSelecionados.indexOf(residuo);
    if (idx === -1) {
      this.tiposResiduosSelecionados.push(residuo);
    } else {
      this.tiposResiduosSelecionados.splice(idx, 1);
    }
  }

  onSubmit() {
    if (!this.isFormValid) {
      this.toastr.warning('Por favor, preencha todos os campos.', 'Atenção');
      return;
    }

    if (!this.caminhao && this.placasExistentes.includes(this.placa)) {
      this.toastr.warning('Já existe um caminhão com essa placa.', 'Atenção');
      return;
    }

    const motoristaObj = this.motoristas.find(m => m.cpf === this.motoristaSelecionadoCpf) ?? null;
    const novoCaminhao: Caminhao = {
      placa: this.placa,
      motorista: motoristaObj,
      tipoResiduo: this.tiposResiduosSelecionados
    };

    const acao$ = this.caminhao
      ? this.caminhaoService.atualizar(novoCaminhao)
      : this.caminhaoService.criar(novoCaminhao);

    acao$.subscribe({
      next: () => {
        this.toastr.success(
          this.caminhao ? 'Caminhão atualizado com sucesso!' : 'Caminhão cadastrado com sucesso!',
          'Sucesso'
        );
        this.router.navigate(['/caminhoes']);
      },
      error: err => {
        console.error('Erro ao salvar caminhão:', err);
        this.toastr.error('Erro ao salvar o caminhão.', 'Erro');
      }
    });
  }

  cancelar() {
    this.toastr.info('Operação cancelada.', 'Cancelado');
    this.router.navigate(['/caminhoes']);
  }
}

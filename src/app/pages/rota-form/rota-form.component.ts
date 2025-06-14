import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RotasService, Rota, Bairro } from '../../services/rotas.service';
import { BairroService } from '../../services/bairro.service';
import { Caminhao, CaminhaoService } from '../../services/caminhao.service';
import { TipoResiduoService } from '../../services/tipoResiduo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/footer/footer.component";
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './rota-form.component.html',
  styleUrls: ['./rota-form.component.scss']
})
export class RotaFormComponent implements OnInit {
  rota: Rota = {
    id: 0,
    nome: '',
    tipoResiduo: '',
    origem: null,
    destino: null,
    pesoTotal: 0,
    caminhao: null,
    ruas: [],
    dataCriacao: new Date().toISOString()
  };

  bairrosOrigem: Bairro[] = [];
  bairrosDestino: Bairro[] = [];
  tiposResiduo: string[] = [];
  caminhoes: Caminhao[] = [];

  isOrigemDestinoEnabled = false;
  tipoResiduoSelecionado: string | null = null;

  idRota: number | null = null;

  constructor(
    private rotasService: RotasService,
    private bairroService: BairroService,
    private caminhaoService: CaminhaoService,
    private tipoResiduoService: TipoResiduoService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.carregarTiposResiduo();
  
    this.idRota = this.route.snapshot.params['id'];
    if (this.idRota) {
      this.rotasService.buscarPorId(this.idRota).subscribe((data) => {
        this.rota = data;
  
        if (this.rota.tipoResiduo) {
          this.tipoResiduoSelecionado = this.rota.tipoResiduo;
          this.carregarBairros(this.tipoResiduoSelecionado);
          this.isOrigemDestinoEnabled = true;
          this.carregarCaminhoes();
        }
      });
    } else {
      this.carregarCaminhoes();
    }
  }

  carregarTiposResiduo() {
    this.tipoResiduoService.listarTipos().subscribe((tipos) => {
      this.tiposResiduo = tipos;
    });
  }

  carregarCaminhoes() {
    this.caminhaoService.listarTodos().subscribe((lista) => {
      this.caminhoes = lista.filter(c =>
        c.tipoResiduo?.includes(this.tipoResiduoSelecionado || '')
      );
    });
  }

  onTipoResiduoChange() {
    if (this.rota.tipoResiduo) {
      this.tipoResiduoSelecionado = this.rota.tipoResiduo;
      this.carregarBairros(this.tipoResiduoSelecionado);
      this.carregarCaminhoes();
      this.isOrigemDestinoEnabled = true;
    } else {
      this.isOrigemDestinoEnabled = false;
      this.bairrosOrigem = [];
      this.bairrosDestino = [];
      this.rota.origem = null;
      this.rota.destino = null;
    }
  }

  carregarBairros(tipoResiduo: string) {
    this.bairroService.listarPorTipoResiduo(tipoResiduo).subscribe((bairros) => {
      this.bairrosOrigem = bairros;
      this.bairrosDestino = bairros;
    });
  }

  /**
   * Funções para o compareWith dos <select>,
   * garantindo que o Angular encontre a opção correta por ID/placa
   */
  compareById = (o1: Bairro | null, o2: Bairro | null): boolean => {
    if (o1 == null && o2 == null) return true;
    return o1 != null && o2 != null && o1.id === o2.id;
  };

  compareCaminhao = (c1: Caminhao | null, c2: Caminhao | null): boolean => {
    if (c1 == null && c2 == null) return true;
    return c1 != null && c2 != null && c1.placa === c2.placa;
  };

  salvar() {
    // validação antes de chamar a API
    if (this.rota.origem?.id === this.rota.destino?.id) {
      this.toastr.error('Origem e destino não podem ser iguais.');
      return;
    }

    if (this.rota.id) {
      this.rotasService.atualizar(this.rota).subscribe({
        next: () => {
          this.toastr.success('Rota atualizada com sucesso!');
          this.router.navigate(['/rotas']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar rota:', error);
          let mensagem = 'Erro ao atualizar rota.';
          if (error.error) {
            if (typeof error.error === 'string') {
              mensagem = error.error;
            } else if (error.error.message) {
              mensagem = error.error.message;
            } else if (error.error.errors) {
              mensagem = Object.values(error.error.errors)
                .flat()
                .join('<br/>');
            }
          }
          this.toastr.error(mensagem, '', { enableHtml: true });
        }
      });
    } else {
      if (this.rota.origem && this.rota.destino && this.rota.caminhao && this.rota.tipoResiduo) {
        this.rotasService.gerarRotaAutomatica(
          this.rota.nome,
          this.rota.origem.id,
          this.rota.destino.id,
          this.rota.tipoResiduo,
          this.rota.caminhao.placa
        ).subscribe({
          next: () => {
            this.toastr.success('Rota gerada com sucesso!');
            this.router.navigate(['/rotas']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao gerar rota:', error);
            let mensagem = 'Erro ao gerar rota.';
            if (error.error) {
              if (typeof error.error === 'string') {
                mensagem = error.error;
              } else if (error.error.message) {
                mensagem = error.error.message;
              }
            }
            this.toastr.error(mensagem, '', { enableHtml: true });
          }
        });
      } else {
        this.toastr.error('Preencha todos os campos obrigatórios!');
      }
    }
  }
}

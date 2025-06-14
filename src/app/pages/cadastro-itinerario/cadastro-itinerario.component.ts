// src/app/pages/cadastro-itinerario/cadastro-itinerario.component.ts

import { Component, OnInit }              from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule, NgForm }            from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ToastrService }                  from 'ngx-toastr';

import { FooterComponent }                from '../../components/footer/footer.component';
import { Itinerario, ItinerarioService }  from '../../services/itinerario.service';
import { Rota, RotasService }             from '../../services/rotas.service';

@Component({
  selector: 'app-cadastro-itinerario',
  standalone: true,
  imports: [
    CommonModule,    // *ngFor, *ngIf
    FormsModule,     // ngForm, ngModel, ngValue
    RouterModule,    // [routerLink]
    FooterComponent  // <app-footer>
  ],
  templateUrl: './cadastro-itinerario.component.html',
  styleUrls: ['./cadastro-itinerario.component.scss']
})
export class CadastroItinerarioComponent implements OnInit {
  itinerario: Itinerario = {
    rota: {} as Rota,
    dataAgendamento: '',
    distanciaTotal: 0
  } as Itinerario;

  rotas: Rota[] = [];

  constructor(
    private srv: ItinerarioService,
    private rotaSrv: RotasService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService         // ← injeta o ToastrService
  ) {}

  ngOnInit(): void {
    this.rotaSrv.listarTodas()
      .subscribe((r: Rota[]) => this.rotas = r);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.srv.buscarPorId(+idParam)
        .subscribe((it: Itinerario) => this.itinerario = it);
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.toastr.warning('Por favor, preencha todos os campos obrigatórios.', 'Atenção');
      return;
    }
  
    const data = this.itinerario.dataAgendamento;
    const dataCompleta = `${data}T00:00:00`; // para salvar depois
    const caminhao = this.itinerario.rota?.caminhao;
  
    if (!caminhao?.placa) {
      this.toastr.warning('Caminhão não está definido para a rota selecionada.', 'Atenção');
      return;
    }
  
    // VERIFICAÇÃO DE CAMINHÃO NA DATA
    this.srv.verificarCaminhaoNaData(caminhao.placa, data).subscribe((ocupado: boolean) => {
      if (ocupado) {
        this.toastr.error('Este caminhão já está agendado para esta data.', 'Conflito de agendamento');
        return;
      }
  
      // continua com o envio normal
      this.itinerario.dataAgendamento = dataCompleta;
  
      const action$ = this.itinerario.id
        ? this.srv.atualizar(this.itinerario)
        : this.srv.salvar(this.itinerario);
  
      action$.subscribe({
        next: () => {
          const msg = this.itinerario.id
            ? 'Itinerário atualizado com sucesso!'
            : 'Itinerário cadastrado com sucesso!';
          this.toastr.success(msg, 'Sucesso');
          this.router.navigate(['/relatorios']);
        },
        error: (err) => {
          console.error('Erro ao salvar itinerário:', err);
          this.toastr.error('Não foi possível salvar o itinerário. Tente novamente.', 'Erro');
        }
      });
    });
  }  

  cancelar(): void {
    this.toastr.info('Cadastro de itinerário cancelado.', 'Cancelado');
    this.router.navigate(['/relatorios']);
  }
}

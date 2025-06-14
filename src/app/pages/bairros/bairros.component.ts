import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BairroService } from '../../services/bairro.service';
import { PontoColetaService } from '../../services/ponto-coleta.service';
import { FooterComponent } from "../../components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bairros',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterModule],
  templateUrl: './bairros.component.html',
  styleUrls: ['./bairros.component.scss'],
})
export class BairrosComponent implements OnInit {
  bairros: any[] = [];
  pontos: any[] = [];

  constructor(
    private bairroService: BairroService,
    private pontoService: PontoColetaService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.bairroService.listarTodos().subscribe(res => this.bairros = res);
    this.pontoService.listarTodos().subscribe(res => this.pontos = res);
  }

  getPontosPorBairro(bairroId: number) {
    return this.pontos.filter(p => p.bairro?.id === bairroId);
  }

  criarNovoBairro() {
    this.router.navigate(['/cadastrar-bairro']);
  }

  criarNovoPonto() {
    this.router.navigate(['/cadastrar-ponto']);
  }

  editarBairro(bairroId: number) {
    this.router.navigate(['/editar-bairro', bairroId]);
  }

  editarPonto(pontoId: number) {
    this.router.navigate(['/cadastrar-ponto', pontoId]);
  }

  excluirBairro(bairroId: number) {
    const pontosVinculados = this.getPontosPorBairro(bairroId);
    if (pontosVinculados.length > 0) {
      this.toastr.error('Este bairro possui pontos de coleta e não pode ser excluído: ', 'Erro');
      return;
    }
  
    this.bairroService.excluir(bairroId).subscribe({
      next: () => {
        console.log(`Bairro com ID ${bairroId} excluído com sucesso.`);
        this.bairros = this.bairros.filter(b => b.id !== bairroId);
      },
      error: err => {
        console.error('Erro ao excluir bairro:', err);
      }
    });
  }  

  excluirPonto(pontoId: number) {
    this.pontoService.excluir(pontoId).subscribe({
      next: () => {
        console.log(`Ponto com ID ${pontoId} excluído com sucesso.`);
        this.pontos = this.pontos.filter(p => p.id !== pontoId);
      },
      error: err => {
        console.error('Erro ao excluir ponto:', err);
      }
    });
  }
}

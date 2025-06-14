// src/app/pages/cadastro-motorista/cadastro-motorista.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MotoristaService, Motorista } from '../../services/motorista.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-cadastro-motorista',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, RouterModule],
  templateUrl: './cadastro-motorista.component.html',
  styleUrls: ['./cadastro-motorista.component.scss']
})
export class CadastroMotoristaComponent implements OnInit {
  motorista: Motorista | null = null;
  cpf: string = '';
  nome: string = '';
  dataNascimento: string = '';
  cpfsExistentes: string[] = [];

  constructor(
    private motoristaService: MotoristaService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService        // ← injeta ToastrService
  ) {}

  ngOnInit() {
    this.motoristaService.listarTodos().subscribe(motoristas => {
      this.cpfsExistentes = motoristas.map(m => this.normalizeCpf(m.cpf));
    });

    const cpfParam = this.route.snapshot.paramMap.get('cpf');
    if (cpfParam) {
      const normalizedCpf = this.normalizeCpf(cpfParam);
      this.motoristaService.buscarPorCpf(normalizedCpf).subscribe({
        next: (m: Motorista) => {
          this.motorista = m;
          this.cpf = m.cpf;
          this.nome = m.nome;
          this.dataNascimento = m.dataNascimento;
        },
        error: () => {
          this.toastr.error('Motorista não encontrado. Verifique o CPF.', 'Erro');
          setTimeout(() => this.router.navigate(['/motoristas']), 3000);
        }
      });
    }
  }

  normalizeCpf(cpf: string): string {
    return cpf.replace(/[\.-]/g, '');
  }

  validarCpf(cpf: string): boolean {
    cpf = this.normalizeCpf(cpf);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let dig1 = 11 - (soma % 11);
    dig1 = dig1 >= 10 ? 0 : dig1;
    if (dig1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    let dig2 = 11 - (soma % 11);
    dig2 = dig2 >= 10 ? 0 : dig2;
    return dig2 === parseInt(cpf.charAt(10));
  }

  get isFormValid(): boolean {
    return (
      this.cpf.trim() !== '' &&
      this.nome.trim() !== '' &&
      this.dataNascimento.trim() !== ''
    );
  }

  onSubmit() {
    if (!this.isFormValid) {
      this.toastr.warning('Por favor, preencha todos os campos.', 'Atenção');
      return;
    }

    const normalizedCpf = this.normalizeCpf(this.cpf);

    if (!this.validarCpf(normalizedCpf)) {
      this.toastr.warning('CPF inválido.', 'Atenção');
      return;
    }

    if (!this.motorista && this.cpfsExistentes.includes(normalizedCpf)) {
      this.toastr.warning('Já existe um motorista com esse CPF.', 'Atenção');
      return;
    }

    const motorista: Motorista = {
      cpf: normalizedCpf,
      nome: this.nome,
      dataNascimento: this.dataNascimento
    };

    const acao$ = this.motorista
      ? this.motoristaService.atualizar(normalizedCpf, motorista)
      : this.motoristaService.adicionar(motorista);

    acao$.subscribe({
      next: () => {
        this.toastr.success(
          this.motorista ? 'Motorista atualizado!' : 'Motorista cadastrado!',
          'Sucesso'
        );
        this.router.navigate(['/motoristas']);
      },
      error: () => {
        this.toastr.error('Erro ao salvar o motorista.', 'Erro');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/motoristas']);
  }
}

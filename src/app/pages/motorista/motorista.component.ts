// src/app/pages/motorista/motorista.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterModule }      from '@angular/router';
import { CommonModule }      from '@angular/common';
import { ToastrService }     from 'ngx-toastr';

import { FooterComponent }      from '../../components/footer/footer.component';
import { Motorista, MotoristaService } from '../../services/motorista.service';

@Component({
  selector: 'app-motorista',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent],
  templateUrl: './motorista.component.html',
  styleUrls: ['./motorista.component.scss']
})
export class MotoristaComponent implements OnInit {
  motoristas: Motorista[] = [];

  constructor(
    private motoristaService: MotoristaService,
    private toastr: ToastrService       // ← injeta ToastrService
  ) {}

  ngOnInit() {
    this.carregarMotoristas();
  }

  carregarMotoristas() {
    this.motoristaService.listarTodos().subscribe({
      next: dados => {
        this.motoristas = dados;
      },
      error: err => {
        console.error('Erro ao carregar motoristas:', err);
        this.toastr.error('Erro ao carregar motoristas.', 'Erro');
      }
    });
  }

  calcularIdade(dataNascimento: string): number {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiff = hoje.getMonth() - nascimento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  formatCpf(cpf: string): string {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length === 11) {
      return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  excluir(cpf: string) {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
      const normalizedCpf = this.normalizeCpf(cpf);
      this.motoristaService.excluir(normalizedCpf).subscribe({
        next: () => {
          this.toastr.success('Motorista excluído com sucesso!', 'Sucesso');
          this.carregarMotoristas();
        },
        error: err => {
          console.error('Erro ao excluir motorista:', err);
          this.toastr.error('Erro ao excluir o motorista.', 'Erro');
        }
      });
    }
  }

  normalizeCpf(cpf: string): string {
    return cpf.replace(/[\.-]/g, '');
  }
}

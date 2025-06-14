// src/app/pages/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService      // ← injeta ToastrService
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.toastr.warning('Por favor, preencha todos os campos.', 'Atenção');
      return;
    }
  
    const dadosLogin = {
      username: this.username,
      password: this.password,
    };
    
    console.log('Enviando login:', dadosLogin);
  
    this.authService.login(dadosLogin).subscribe({
      next: (res) => {
        console.log('Resposta do backend:', res);
        if (res.success) {
          this.toastr.success('Login bem-sucedido!', 'Sucesso');
          this.errorMessage = '';
          this.router.navigate(['']);
        } else {
          this.toastr.error('Usuário ou senha inválidos.', 'Erro');
          this.errorMessage = 'Usuário ou senha inválidos';
        }
      },
      error: (err) => {
        console.error('Erro na requisição:', err);
        this.toastr.error('Erro ao tentar fazer login. Tente novamente.', 'Erro');
        this.errorMessage = 'Erro ao tentar fazer login. Tente novamente.';
      }
    });
  }
}

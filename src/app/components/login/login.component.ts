// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      try {
        await this.authService.login(email, password);
      } catch (error: any) {
        this.loading = false;

        // Traduzir erros do Firebase
        switch (error.code) {
          case 'auth/user-not-found':
            this.errorMessage = 'Usuário não encontrado';
            break;
          case 'auth/wrong-password':
            this.errorMessage = 'Senha incorreta';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Email inválido';
            break;
          case 'auth/user-disabled':
            this.errorMessage = 'Usuário desabilitado';
            break;
          case 'auth/too-many-requests':
            this.errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
            break;
          default:
            this.errorMessage = 'Erro ao fazer login. Tente novamente';
        }
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async forgotPassword(): Promise<void> {
    const email = this.loginForm.get('email')?.value;

    if (!email) {
      this.errorMessage = 'Digite seu email para recuperar a senha';
      return;
    }

    try {
      await this.authService.resetPassword(email);
      alert('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      this.errorMessage = 'Erro ao enviar email de recuperação';
    }
  }
}

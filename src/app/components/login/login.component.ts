import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;

      const { email, password } = this.loginForm.value;

      try {
        await this.authService.login(email, password);
        // Sucesso é tratado pelo AuthService com redirect
      } catch (error: any) {
        this.loading = false;

        let errorMessage = 'Erro ao fazer login. Tente novamente.';

        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado. Verifique o email digitado.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Senha incorreta. Tente novamente ou clique em "Esqueci minha senha".';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido. Verifique o formato do email.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Esta conta foi desabilitada. Entre em contato com o administrador.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            break;
        }

        this.notificationService.error(errorMessage, 5000);
      }
    } else {
      this.loginForm.markAllAsTouched();

      if (this.loginForm.get('email')?.hasError('required')) {
        this.notificationService.warning('Por favor, digite seu email.');
      } else if (this.loginForm.get('email')?.hasError('email')) {
        this.notificationService.warning('Por favor, digite um email válido.');
      } else if (this.loginForm.get('password')?.hasError('required')) {
        this.notificationService.warning('Por favor, digite sua senha.');
      } else if (this.loginForm.get('password')?.hasError('minlength')) {
        this.notificationService.warning('A senha deve ter no mínimo 6 caracteres.');
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async forgotPassword(): Promise<void> {
    const emailControl = this.loginForm.get('email');
    const email = emailControl?.value?.trim();

    if (!email) {
      this.notificationService.warning('Por favor, digite seu email no campo acima para recuperar a senha.');
      emailControl?.markAsTouched();
      return;
    }

    if (emailControl?.hasError('email')) {
      this.notificationService.warning('Por favor, digite um email válido.');
      emailControl?.markAsTouched();
      return;
    }

    this.notificationService.confirm(
      'Recuperar Senha',
      `Um email de recuperação será enviado para:\n\n${email}\n\nDeseja continuar?`,
      'Enviar Email',
      'Cancelar',
      'info'
    ).subscribe(async confirmed => {
      if (confirmed) {
        this.loading = true;

        try {
          await this.authService.resetPassword(email);
          this.notificationService.success(
            'Email de recuperação enviado! Verifique sua caixa de entrada e spam.',
            6000
          );

          this.loginForm.reset();
        } catch (error: any) {
          console.error('Erro ao enviar email de recuperação:', error);

          let errorMessage = 'Erro ao enviar email de recuperação. Tente novamente.';

          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'Nenhuma conta encontrada com este email.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Email inválido. Verifique o formato do email.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
              break;
            case 'auth/network-request-failed':
              errorMessage = 'Erro de conexão. Verifique sua internet.';
              break;
          }

          this.notificationService.error(errorMessage, 5000);
        } finally {
          this.loading = false;
        }
      }
    });
  }
}

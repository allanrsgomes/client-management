import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';
import { App } from '../../models/app.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit {
  apps$!: Observable<App[]>;
  searchTerm: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApps();
  }

  loadApps(): void {
    this.apps$ = this.firebaseService.getApps();
  }

  createApp(): void {
    this.notificationService.prompt(
      'Criar Novo App',
      'Nome do App',
      '',
      'Digite o nome do app...',
      true
    ).subscribe(name => {
      if (name && name.trim()) {
        const newApp: Omit<App, 'id'> = {
          name: name.trim(),
          active: true,
          createdAt: new Date().toISOString()
        };

        this.firebaseService.createApp(newApp)
          .then(() => {
            this.notificationService.success('App criado com sucesso!');
          })
          .catch(error => {
            console.error('Erro ao criar app:', error);
            this.notificationService.error('Erro ao criar app. Tente novamente.');
          });
      }
    });
  }

  async editApp(app: App): Promise<void> {
    if (!app.id) return;

    this.notificationService.prompt(
      'Editar App',
      'Nome do App',
      app.name,
      'Digite o novo nome...',
      true
    ).subscribe(async newName => {
      if (newName && newName.trim() && newName !== app.name) {
        try {
          await this.firebaseService.updateApp(app.id!, { name: newName.trim() });
          this.notificationService.success('App atualizado com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar app:', error);
          this.notificationService.error('Erro ao atualizar app. Tente novamente.');
        }
      }
    });
  }

  async toggleStatus(app: App): Promise<void> {
    if (!app.id) return;

    const action = app.active ? 'desativar' : 'ativar';
    const title = app.active ? 'Desativar App' : 'Ativar App';
    const message = `Deseja realmente ${action} o app "${app.name}"?`;

    this.notificationService.confirm(
      title,
      message,
      'Confirmar',
      'Cancelar',
      'warning'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.toggleAppStatus(app.id!, !app.active);
          this.notificationService.success(
            `App ${app.active ? 'desativado' : 'ativado'} com sucesso!`
          );
        } catch (error) {
          console.error('Erro ao alterar status:', error);
          this.notificationService.error('Erro ao alterar status. Tente novamente.');
        }
      }
    });
  }

  async deleteApp(app: App): Promise<void> {
    if (!app.id) return;

    this.notificationService.confirm(
      'Excluir App',
      `Deseja realmente excluir o app "${app.name}"?\n\nAtenção: Esta ação não pode ser desfeita!`,
      'Excluir',
      'Cancelar',
      'danger'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.deleteApp(app.id!);
          this.notificationService.success('App excluído com sucesso!');
        } catch (error) {
          console.error('Erro ao deletar app:', error);
          this.notificationService.error('Erro ao deletar app. Tente novamente.');
        }
      }
    });
  }

  getFilteredApps(apps: App[]): App[] {
    if (!this.searchTerm) return apps;

    const term = this.searchTerm.toLowerCase();
    return apps.filter(app =>
      app.name.toLowerCase().includes(term)
    );
  }
}

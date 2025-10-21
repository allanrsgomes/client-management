
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';
import { Server } from '../../models/server.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent implements OnInit {
  servers$!: Observable<Server[]>;
  searchTerm: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.servers$ = this.firebaseService.getServers();
  }

  createServer(): void {
    this.notificationService.prompt(
      'Criar Novo Servidor',
      'Nome do Servidor',
      '',
      'Digite o nome do servidor...',
      true
    ).subscribe(name => {
      if (name && name.trim()) {
        const newServer: Omit<Server, 'id'> = {
          name: name.trim(),
          active: true,
          createdAt: new Date().toISOString()
        };

        this.firebaseService.createServer(newServer)
          .then(() => {
            this.notificationService.success('Servidor criado com sucesso!');
          })
          .catch(error => {
            console.error('Erro ao criar servidor:', error);
            this.notificationService.error('Erro ao criar servidor. Tente novamente.');
          });
      }
    });
  }

  async editServer(server: Server): Promise<void> {
    if (!server.id) return;

    this.notificationService.prompt(
      'Editar Servidor',
      'Nome do Servidor',
      server.name,
      'Digite o novo nome...',
      true
    ).subscribe(async newName => {
      if (newName && newName.trim() && newName !== server.name) {
        try {
          await this.firebaseService.updateServer(server.id!, { name: newName.trim() });
          this.notificationService.success('Servidor atualizado com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar servidor:', error);
          this.notificationService.error('Erro ao atualizar servidor. Tente novamente.');
        }
      }
    });
  }

  async toggleStatus(server: Server): Promise<void> {
    if (!server.id) return;

    const action = server.active ? 'desativar' : 'ativar';
    const title = server.active ? 'Desativar Servidor' : 'Ativar Servidor';
    const message = `Deseja realmente ${action} o servidor "${server.name}"?`;

    this.notificationService.confirm(
      title,
      message,
      'Confirmar',
      'Cancelar',
      'warning'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.toggleServerStatus(server.id!, !server.active);
          this.notificationService.success(
            `Servidor ${server.active ? 'desativado' : 'ativado'} com sucesso!`
          );
        } catch (error) {
          console.error('Erro ao alterar status:', error);
          this.notificationService.error('Erro ao alterar status. Tente novamente.');
        }
      }
    });
  }

  async deleteServer(server: Server): Promise<void> {
    if (!server.id) return;

    this.notificationService.confirm(
      'Excluir Servidor',
      `Deseja realmente excluir o servidor "${server.name}"?\n\nAtenção: Esta ação não pode ser desfeita!`,
      'Excluir',
      'Cancelar',
      'danger'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.deleteServer(server.id!);
          this.notificationService.success('Servidor excluído com sucesso!');
        } catch (error) {
          console.error('Erro ao deletar servidor:', error);
          this.notificationService.error('Erro ao deletar servidor. Tente novamente.');
        }
      }
    });
  }

  getFilteredServers(servers: Server[]): Server[] {
    if (!this.searchTerm) return servers;

    const term = this.searchTerm.toLowerCase();
    return servers.filter(server =>
      server.name.toLowerCase().includes(term)
    );
  }
}

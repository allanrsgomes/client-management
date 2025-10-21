import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss']
})
export class ClientViewComponent implements OnInit {
  client?: Client;
  loading = true;

  constructor(
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(clientId);
    } else {
      this.notificationService.error('ID do cliente não encontrado.');
      this.router.navigate(['/clients']);
    }
  }

  loadClient(id: string): void {
    this.firebaseService.getClient(id).subscribe({
      next: (client) => {
        this.client = client;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cliente:', error);
        this.loading = false;
        this.notificationService.error('Erro ao carregar dados do cliente.');
        this.router.navigate(['/clients']);
      }
    });
  }

  editClient(): void {
    if (this.client?.id) {
      this.router.navigate(['/clients/edit', this.client.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  async toggleArchive(): Promise<void> {
    if (!this.client?.id) return;

    const action = this.client.archived ? 'desarquivar' : 'arquivar';
    const title = this.client.archived ? 'Desarquivar Cliente' : 'Arquivar Cliente';
    const message = `Deseja realmente ${action} o cliente "${this.client.name}"?`;

    this.notificationService.confirm(
      title,
      message,
      'Confirmar',
      'Cancelar',
      'warning'
    ).subscribe(async confirmed => {
      if (confirmed && this.client?.id) {
        try {
          await this.firebaseService.toggleArchiveClient(
            this.client.id,
            !this.client.archived
          );

          this.client.archived = !this.client.archived;
          if (this.client.archived) {
            this.client.archivedAt = new Date().toISOString().split('T')[0];
          } else {
            this.client.archivedAt = undefined;
          }

          this.notificationService.success(
            `Cliente ${this.client.archived ? 'arquivado' : 'desarquivado'} com sucesso!`
          );
        } catch (error) {
          console.error('Erro ao arquivar/desarquivar cliente:', error);
          this.notificationService.error(
            `Erro ao ${action} cliente. Tente novamente.`
          );
        }
      }
    });
  }

  async deleteClient(): Promise<void> {
    if (!this.client?.id) return;

    this.notificationService.confirm(
      'Excluir Cliente',
      `Deseja realmente excluir o cliente "${this.client.name}"?\n\nAtenção: Esta ação não pode ser desfeita e todos os dados serão perdidos permanentemente!`,
      'Excluir',
      'Cancelar',
      'danger'
    ).subscribe(async confirmed => {
      if (confirmed && this.client?.id) {
        try {
          await this.firebaseService.deleteClient(this.client.id);
          this.notificationService.success('Cliente excluído com sucesso!');
          this.router.navigate(['/clients']);
        } catch (error) {
          console.error('Erro ao deletar cliente:', error);
          this.notificationService.error('Erro ao excluir cliente. Tente novamente.');
        }
      }
    });
  }

  formatMac(mac: any): string {
    if (typeof mac === 'string') {
      return mac.toUpperCase();
    }

    if (mac && mac.address) {
      return mac.address.toUpperCase();
    }
    return 'N/A';
  }
}

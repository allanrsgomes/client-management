import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';
import { ClientFilterService } from '../../services/client-filter.service';
import { ClientSortService, SortField, SortDirection } from '../../services/client-sort.service';
import { Client } from '../../models/client.model';
import { DateUtils } from '../../utils/date.utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients$!: Observable<Client[]>;
  searchTerm: string = '';
  showArchived: boolean = false;
  sortField: SortField = 'daysUntilExpiry';
  sortDirection: SortDirection = 'asc';
  dateUtils = DateUtils;

  // Paginação
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private firebaseService: FirebaseService,
    private notificationService: NotificationService,
    private filterService: ClientFilterService,
    private sortService: ClientSortService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clients$ = this.firebaseService.getClients().pipe(
      map(clients => {
        // Aplica filtros
        const filtered = this.filterService.applyFilters(
          clients,
          this.searchTerm,
          this.showArchived
        );

        // Aplica ordenação
        const sorted = this.sortService.sort(filtered, this.sortField, this.sortDirection);

        // Calcula paginação
        this.totalItems = sorted.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

        // Ajusta página atual se necessário
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        }

        // Retorna apenas os itens da página atual
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return sorted.slice(startIndex, endIndex);
      })
    );
  }

  sort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1; // Volta para primeira página ao ordenar
    this.loadClients();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) {
      return 'unfold_more';
    }
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  onSearchChange(): void {
    this.currentPage = 1; // Volta para primeira página ao buscar
    this.loadClients();
  }

  onArchivedChange(): void {
    this.currentPage = 1; // Volta para primeira página ao mudar filtro
    this.loadClients();
  }

  // Métodos de paginação
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadClients();
      // Scroll para o topo da lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Mostra todas as páginas se forem poucas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com reticências
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, this.currentPage - halfVisible);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  getStartItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  async renewClient(client: Client): Promise<void> {
    if (!client.id) return;

    const currentDate = client.date ? DateUtils.formatToBrazilian(client.date) : 'Sem data';
    const newDate = DateUtils.renewExpiryDate(client.date);
    const newDateFormatted = DateUtils.formatToBrazilian(newDate);

    this.notificationService.confirm(
      'Renovar Cliente',
      `Deseja renovar o cliente "${client.name}"?\n\nData atual: ${currentDate}\nNova data: ${newDateFormatted}`,
      'Renovar',
      'Cancelar',
      'info'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.updateClient(client.id!, {
            date: newDate
          });
          this.notificationService.success(
            `Cliente renovado com sucesso! Nova data de vencimento: ${newDateFormatted}`
          );
        } catch (error) {
          console.error('Erro ao renovar cliente:', error);
          this.notificationService.error('Erro ao renovar cliente. Tente novamente.');
        }
      }
    });
  }

  async togglePaymentStatus(client: Client): Promise<void> {
    if (!client.id) return;

    const action = client.paid ? 'marcar como não pago' : 'marcar como pago';
    const title = client.paid ? 'Marcar como Não Pago' : 'Marcar como Pago';
    const message = `Deseja realmente ${action} o cliente "${client.name}"?`;

    this.notificationService.confirm(
      title,
      message,
      'Confirmar',
      'Cancelar',
      'info'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.updateClient(client.id!, { paid: !client.paid });
          this.notificationService.success(
            `Status de pagamento atualizado para ${!client.paid ? 'Pago' : 'Não Pago'}!`
          );
        } catch (error) {
          console.error('Erro ao alterar status de pagamento:', error);
          this.notificationService.error('Erro ao alterar status de pagamento. Tente novamente.');
        }
      }
    });
  }

  async toggleArchive(client: Client): Promise<void> {
    if (!client.id) return;

    const action = client.archived ? 'desarquivar' : 'arquivar';
    const title = client.archived ? 'Desarquivar Cliente' : 'Arquivar Cliente';
    const message = `Deseja realmente ${action} o cliente "${client.name}"?`;

    this.notificationService.confirm(
      title,
      message,
      'Confirmar',
      'Cancelar',
      'warning'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.toggleArchiveClient(client.id!, !client.archived);
          this.notificationService.success(
            `Cliente ${client.archived ? 'desarquivado' : 'arquivado'} com sucesso!`
          );
        } catch (error) {
          console.error('Erro ao arquivar cliente:', error);
          this.notificationService.error('Erro ao arquivar cliente. Tente novamente.');
        }
      }
    });
  }

  async deleteClient(client: Client): Promise<void> {
    if (!client.id) return;

    this.notificationService.confirm(
      'Excluir Cliente',
      `Deseja realmente EXCLUIR PERMANENTEMENTE o cliente "${client.name}"?\n\nAtenção: Esta ação não pode ser desfeita e todos os dados do cliente serão perdidos!`,
      'Excluir',
      'Cancelar',
      'danger'
    ).subscribe(async confirmed => {
      if (confirmed) {
        try {
          await this.firebaseService.deleteClient(client.id!);
          this.notificationService.success('Cliente excluído com sucesso!');
        } catch (error) {
          console.error('Erro ao deletar cliente:', error);
          this.notificationService.error('Erro ao deletar cliente. Tente novamente.');
        }
      }
    });
  }

  viewClient(id: string): void {
    this.router.navigate(['/clients/view', id]);
  }

  editClient(id: string): void {
    this.router.navigate(['/clients/edit', id]);
  }

  createClient(): void {
    this.router.navigate(['/clients/create']);
  }
}

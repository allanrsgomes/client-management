import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
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

  constructor(
    private firebaseService: FirebaseService,
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
        const filtered = this.filterService.applyFilters(
          clients,
          this.searchTerm,
          this.showArchived
        );
        return this.sortService.sort(filtered, this.sortField, this.sortDirection);
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
    this.loadClients();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) {
      return 'unfold_more';
    }
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  onSearchChange(): void {
    this.loadClients();
  }

  onArchivedChange(): void {
    this.loadClients();
  }

  async togglePaymentStatus(client: Client): Promise<void> {
    if (!client.id) return;

    try {
      await this.firebaseService.updateClient(client.id, { paid: !client.paid });
    } catch (error) {
      console.error('Erro ao alterar status de pagamento:', error);
      alert('Erro ao alterar status de pagamento. Tente novamente.');
    }
  }

  async toggleArchive(client: Client): Promise<void> {
    if (!client.id) return;

    const action = client.archived ? 'desarquivar' : 'arquivar';
    if (confirm(`Deseja realmente ${action} o cliente ${client.name}?`)) {
      try {
        await this.firebaseService.toggleArchiveClient(client.id, !client.archived);
      } catch (error) {
        console.error('Erro ao arquivar cliente:', error);
        alert('Erro ao arquivar cliente. Tente novamente.');
      }
    }
  }

  async deleteClient(client: Client): Promise<void> {
    if (!client.id) return;

    if (confirm(`Deseja realmente EXCLUIR PERMANENTEMENTE o cliente ${client.name}?`)) {
      try {
        await this.firebaseService.deleteClient(client.id);
        alert('Cliente excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        alert('Erro ao deletar cliente. Tente novamente.');
      }
    }
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

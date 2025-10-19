// src/app/components/client-view/client-view.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(clientId);
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
        alert('Erro ao carregar cliente');
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
    if (this.client?.id) {
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
      } catch (error) {
        console.error('Erro ao arquivar cliente:', error);
        alert('Erro ao arquivar cliente');
      }
    }
  }

  async deleteClient(): Promise<void> {
    if (this.client?.id && confirm(`Deseja realmente excluir o cliente ${this.client.name}?`)) {
      try {
        await this.firebaseService.deleteClient(this.client.id);
        alert('Cliente excluído com sucesso!');
        this.router.navigate(['/clients']);
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        alert('Erro ao deletar cliente');
      }
    }
  }
}

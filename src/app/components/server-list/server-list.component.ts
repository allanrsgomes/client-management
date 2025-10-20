// src/app/components/server-list/server-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.servers$ = this.firebaseService.getServers();
  }

  createServer(): void {
    const name = prompt('Nome do Servidor:');
    if (name && name.trim()) {
      const newServer: Omit<Server, 'id'> = {
        name: name.trim(),
        active: true,
        createdAt: new Date().toISOString()
      };

      this.firebaseService.createServer(newServer)
        .then(() => {
          alert('Servidor criado com sucesso!');
        })
        .catch(error => {
          console.error('Erro ao criar servidor:', error);
          alert('Erro ao criar servidor. Tente novamente.');
        });
    }
  }

  async editServer(server: Server): Promise<void> {
    if (!server.id) return;

    const newName = prompt('Editar nome do Servidor:', server.name);
    if (newName && newName.trim() && newName !== server.name) {
      try {
        await this.firebaseService.updateServer(server.id, { name: newName.trim() });
        alert('Servidor atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar servidor:', error);
        alert('Erro ao atualizar servidor. Tente novamente.');
      }
    }
  }

  async toggleStatus(server: Server): Promise<void> {
    if (!server.id) return;

    try {
      await this.firebaseService.toggleServerStatus(server.id, !server.active);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status. Tente novamente.');
    }
  }

  async deleteServer(server: Server): Promise<void> {
    if (!server.id) return;

    if (confirm(`Deseja realmente excluir o servidor "${server.name}"?\n\nAtenção: Esta ação não pode ser desfeita!`)) {
      try {
        await this.firebaseService.deleteServer(server.id);
        alert('Servidor excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar servidor:', error);
        alert('Erro ao deletar servidor. Tente novamente.');
      }
    }
  }

  getFilteredServers(servers: Server[]): Server[] {
    if (!this.searchTerm) return servers;

    const term = this.searchTerm.toLowerCase();
    return servers.filter(server =>
      server.name.toLowerCase().includes(term)
    );
  }
}

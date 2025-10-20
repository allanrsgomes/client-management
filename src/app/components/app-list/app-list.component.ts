// src/app/components/app-list/app-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApps();
  }

  loadApps(): void {
    this.apps$ = this.firebaseService.getApps();
  }

  createApp(): void {
    const name = prompt('Nome do App:');
    if (name && name.trim()) {
      const newApp: Omit<App, 'id'> = {
        name: name.trim(),
        active: true,
        createdAt: new Date().toISOString()
      };

      this.firebaseService.createApp(newApp)
        .then(() => {
          alert('App criado com sucesso!');
        })
        .catch(error => {
          console.error('Erro ao criar app:', error);
          alert('Erro ao criar app. Tente novamente.');
        });
    }
  }

  async editApp(app: App): Promise<void> {
    if (!app.id) return;

    const newName = prompt('Editar nome do App:', app.name);
    if (newName && newName.trim() && newName !== app.name) {
      try {
        await this.firebaseService.updateApp(app.id, { name: newName.trim() });
        alert('App atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar app:', error);
        alert('Erro ao atualizar app. Tente novamente.');
      }
    }
  }

  async toggleStatus(app: App): Promise<void> {
    if (!app.id) return;

    try {
      await this.firebaseService.toggleAppStatus(app.id, !app.active);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status. Tente novamente.');
    }
  }

  async deleteApp(app: App): Promise<void> {
    if (!app.id) return;

    if (confirm(`Deseja realmente excluir o app "${app.name}"?\n\nAtenção: Esta ação não pode ser desfeita!`)) {
      try {
        await this.firebaseService.deleteApp(app.id);
        alert('App excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar app:', error);
        alert('Erro ao deletar app. Tente novamente.');
      }
    }
  }

  getFilteredApps(apps: App[]): App[] {
    if (!this.searchTerm) return apps;

    const term = this.searchTerm.toLowerCase();
    return apps.filter(app =>
      app.name.toLowerCase().includes(term)
    );
  }
}

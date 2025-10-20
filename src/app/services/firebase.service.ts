// src/app/services/firebase.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../models/client.model';
import { App } from '../models/app.model';
import { Server } from '../models/server.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  // ========== CLIENTES ==========

  getClients(): Observable<Client[]> {
    return this.firestore.collection<Client>('customers').valueChanges({ idField: 'id' });
  }

  getClient(id: string): Observable<Client | undefined> {
    return this.firestore.collection('customers').doc<Client>(id).valueChanges({ idField: 'id' });
  }

  async createClient(client: Omit<Client, 'id'>): Promise<any> {
    return await this.firestore.collection('customers').add(client);
  }

  async updateClient(id: string, client: Partial<Client>): Promise<void> {
    return await this.firestore.collection('customers').doc(id).update(client);
  }

  async deleteClient(id: string): Promise<void> {
    return await this.firestore.collection('customers').doc(id).delete();
  }

  async toggleArchiveClient(id: string, archived: boolean): Promise<void> {
    const archivedAt = archived ? new Date().toISOString().split('T')[0] : null;
    return await this.firestore.collection('customers').doc(id).update({
      archived,
      archivedAt
    });
  }

  // ========== APPS ==========
  getApps(): Observable<App[]> {
    return this.firestore.collection<App>('applications').valueChanges({ idField: 'id' }).pipe(
      map(apps => apps.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getActiveApps(): Observable<App[]> {
    return this.firestore.collection<App>('applications').valueChanges({ idField: 'id' }).pipe(
      map(apps => {
        // Filtra apenas apps ativos e ordena por nome
        const activeApps = apps
          .filter(app => app.active === true)
          .sort((a, b) => a.name.localeCompare(b.name));
        console.log('Apps retornados do Firebase:', activeApps);
        return activeApps;
      })
    );
  }

  getApp(id: string): Observable<App | undefined> {
    return this.firestore.collection('applications').doc<App>(id).valueChanges({ idField: 'id' });
  }

  async createApp(app: Omit<App, 'id'>): Promise<any> {
    return await this.firestore.collection('applications').add(app);
  }

  async updateApp(id: string, app: Partial<App>): Promise<void> {
    return await this.firestore.collection('applications').doc(id).update(app);
  }

  async deleteApp(id: string): Promise<void> {
    return await this.firestore.collection('applications').doc(id).delete();
  }

  async toggleAppStatus(id: string, active: boolean): Promise<void> {
    return await this.firestore.collection('applications').doc(id).update({ active });
  }


  // ========== SERVERS ==========
  getServers(): Observable<Server[]> {
    return this.firestore.collection<Server>('servers').valueChanges({ idField: 'id' }).pipe(
      map(servers => servers.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }

  getActiveServers(): Observable<Server[]> {
    return this.firestore.collection<Server>('servers').valueChanges({ idField: 'id' }).pipe(
      map(servers => {
        // Filtra apenas servidores ativos e ordena por nome
        const activeServers = servers
          .filter(server => server.active === true)
          .sort((a, b) => a.name.localeCompare(b.name));
        console.log('Servidores retornados do Firebase:', activeServers);
        return activeServers;
      })
    );
  }

  getServer(id: string): Observable<Server | undefined> {
    return this.firestore.collection('servers').doc<Server>(id).valueChanges({ idField: 'id' });
  }

  async createServer(server: Omit<Server, 'id'>): Promise<any> {
    return await this.firestore.collection('servers').add(server);
  }

  async updateServer(id: string, server: Partial<Server>): Promise<void> {
    return await this.firestore.collection('servers').doc(id).update(server);
  }

  async deleteServer(id: string): Promise<void> {
    return await this.firestore.collection('servers').doc(id).delete();
  }

  async toggleServerStatus(id: string, active: boolean): Promise<void> {
    return await this.firestore.collection('servers').doc(id).update({ active });
  }
}

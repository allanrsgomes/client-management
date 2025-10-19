// src/app/services/firebase.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) {}

  // Obter todos os clientes
  getClients(): Observable<Client[]> {
    return this.firestore.collection<Client>('customers').valueChanges({ idField: 'id' });
  }

  // Obter um cliente específico
  getClient(id: string): Observable<Client | undefined> {
    return this.firestore.collection('customers').doc<Client>(id).valueChanges({ idField: 'id' });
  }

  // Criar novo cliente
  async createClient(client: Omit<Client, 'id'>): Promise<any> {
    return await this.firestore.collection('customers').add(client);
  }

  // Atualizar cliente
  async updateClient(id: string, client: Partial<Client>): Promise<void> {
    return await this.firestore.collection('customers').doc(id).update(client);
  }

  // Deletar cliente
  async deleteClient(id: string): Promise<void> {
    return await this.firestore.collection('customers').doc(id).delete();
  }

  // Arquivar/desarquivar cliente
  async toggleArchiveClient(id: string, archived: boolean): Promise<void> {
    const archivedAt = archived ? new Date().toISOString().split('T')[0] : null;
    return await this.firestore.collection('customers').doc(id).update({
      archived,
      archivedAt
    });
  }
}

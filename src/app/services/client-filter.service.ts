// src/app/services/client-filter.service.ts

import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { StringUtils } from '../utils/string.utils';

@Injectable({
  providedIn: 'root'
})
export class ClientFilterService {
  /**
   * Filtra clientes baseado no termo de busca
   */
  filterBySearch(clients: Client[], searchTerm: string): Client[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return clients;
    }

    const term = searchTerm.toLowerCase().trim();
    const searchNormalized = StringUtils.normalize(term);
    const searchNumbers = StringUtils.onlyNumbers(term);

    return clients.filter(client => {
      const nameMatch = client.name && StringUtils.normalize(client.name).includes(searchNormalized);
      const cpfMatch = client.cpf && searchNumbers && StringUtils.onlyNumbers(client.cpf).includes(searchNumbers);
      const phoneMatch = client.phone && searchNumbers && StringUtils.onlyNumbers(client.phone).includes(searchNumbers);
      const cityMatch = client.address?.city && StringUtils.normalize(client.address.city).includes(searchNormalized);
      const streetMatch = client.address?.street && StringUtils.normalize(client.address.street).includes(searchNormalized);
      const appMatch = client.app?.some(app => app && StringUtils.normalize(app).includes(searchNormalized)) || false;
      const serverMatch = client.server?.some(server => server && StringUtils.normalize(server).includes(searchNormalized)) || false;
      const ufMatch = client.address?.uf && StringUtils.normalize(client.address.uf).includes(searchNormalized);

      return !!(nameMatch || cpfMatch || phoneMatch || cityMatch || streetMatch || appMatch || serverMatch || ufMatch);
    });
  }

  /**
   * Filtra clientes arquivados
   */
  filterByArchived(clients: Client[], showArchived: boolean): Client[] {
    return clients.filter(client => {
      return showArchived ? client.archived : !client.archived;
    });
  }

  /**
   * Aplica todos os filtros
   */
  applyFilters(clients: Client[], searchTerm: string, showArchived: boolean): Client[] {
    let filtered = this.filterByArchived(clients, showArchived);
    filtered = this.filterBySearch(filtered, searchTerm);
    return filtered;
  }
}

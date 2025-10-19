// src/app/services/client-sort.service.ts

import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { DateUtils } from '../utils/date.utils';

export type SortField = 'name' | 'cpf' | 'phone' | 'price' | 'city' | 'date' | 'daysUntilExpiry';
export type SortDirection = 'asc' | 'desc';

@Injectable({
  providedIn: 'root'
})
export class ClientSortService {
  /**
   * Ordena clientes por campo específico
   */
  sort(clients: Client[], field: SortField, direction: SortDirection): Client[] {
    if (!clients || clients.length === 0) return [];

    return [...clients].sort((a, b) => {
      let compareA: any;
      let compareB: any;

      switch (field) {
        case 'name':
          compareA = a.name?.toLowerCase() || '';
          compareB = b.name?.toLowerCase() || '';
          break;
        case 'cpf':
          compareA = a.cpf || '';
          compareB = b.cpf || '';
          break;
        case 'phone':
          compareA = a.phone || '';
          compareB = b.phone || '';
          break;
        case 'price':
          compareA = a.price || 0;
          compareB = b.price || 0;
          break;
        case 'city':
          compareA = a.address?.city?.toLowerCase() || '';
          compareB = b.address?.city?.toLowerCase() || '';
          break;
        case 'date':
          compareA = a.date ? new Date(a.date).getTime() : Infinity;
          compareB = b.date ? new Date(b.date).getTime() : Infinity;
          break;
        case 'daysUntilExpiry':
          compareA = DateUtils.getDaysUntilDate(a.date);
          compareB = DateUtils.getDaysUntilDate(b.date);
          if (compareA === Infinity) compareA = 999999;
          if (compareB === Infinity) compareB = 999999;
          break;
        default:
          compareA = a.name?.toLowerCase() || '';
          compareB = b.name?.toLowerCase() || '';
      }

      if (compareA < compareB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}

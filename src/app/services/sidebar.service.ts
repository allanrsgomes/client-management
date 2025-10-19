// src/app/services/sidebar.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  public collapsed$: Observable<boolean> = this.collapsedSubject.asObservable();

  constructor() {
    // Verifica o tamanho da tela inicial
    this.checkInitialScreenSize();
  }

  private checkInitialScreenSize(): void {
    if (window.innerWidth <= 768) {
      this.collapsedSubject.next(true);
    }
  }

  toggleSidebar(): void {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  setSidebarState(collapsed: boolean): void {
    this.collapsedSubject.next(collapsed);
  }

  isCollapsed(): boolean {
    return this.collapsedSubject.value;
  }
}

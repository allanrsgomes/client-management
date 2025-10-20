// src/app/components/sidebar/sidebar.component.ts

import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarService } from '../../services/sidebar.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  activeRoute = '';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Clientes',
      icon: 'people',
      route: '/clients'
    },
    {
      label: 'Apps',
      icon: 'apps',
      route: '/apps'
    },
    {
      label: 'Servidores',
      icon: 'dns',
      route: '/servers'
    },
    {
      label: 'Financeiro',
      icon: 'attach_money',
      route: '/financial'
    },
    {
      label: 'Relatórios',
      icon: 'assessment',
      route: '/reports'
    },
    {
      label: 'Configurações',
      icon: 'settings',
      route: '/settings'
    }
  ];

  constructor(
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    // Detecta mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.url;
    });

    this.activeRoute = this.router.url;

    // Observa mudanças no estado do sidebar
    this.sidebarService.collapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });

    // Auto-colapsa em telas pequenas
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (window.innerWidth <= 768) {
      this.sidebarService.setSidebarState(true);
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

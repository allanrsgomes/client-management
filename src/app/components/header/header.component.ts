// src/app/components/header/header.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDarkMode = false;
  userEmail = '';
  isSidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) { }

  async ngOnInit(): Promise<void> {
    // Observar mudanças de tema
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Observar estado do sidebar
    this.sidebarService.collapsed$.subscribe(collapsed => {
      this.isSidebarCollapsed = collapsed;
    });

    // Obter email do usuário
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.userEmail = user.email;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  async logout(): Promise<void> {
    if (confirm('Deseja realmente sair?')) {
      await this.authService.logout();
    }
  }
}

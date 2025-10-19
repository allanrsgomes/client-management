// Atualizar layout.component.ts

import { Component, OnInit, HostListener } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobile = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.collapsed$.subscribe(collapsed => {
      this.isSidebarCollapsed = collapsed;
    });

    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.sidebarService.setSidebarState(true);
    }
  }
}

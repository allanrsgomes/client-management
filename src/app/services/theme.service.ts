// src/app/services/theme.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    this.initializeTheme();
    this.watchSystemTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      // Se tem tema salvo, usa ele
      this.setTheme(savedTheme === 'dark');
    } else {
      // Se não tem tema salvo, usa preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark);
    }
  }

  private watchSystemTheme(): void {
    // Observa mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      // Só muda automaticamente se o usuário não tiver escolhido manualmente
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches);
      }
    });
  }

  toggleTheme(): void {
    this.setTheme(!this.darkMode.value);
  }

  setTheme(isDark: boolean): void {
    this.darkMode.next(isDark);

    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }
}

import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly DARK_MODE_KEY = 'darkMode';
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Load theme from localStorage on init
    const savedTheme = localStorage.getItem(this.DARK_MODE_KEY);
    if (savedTheme !== null) {
      this.isDarkMode.set(savedTheme === 'true');
    } else {
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode.set(prefersDark);
      }
    }

    // Apply theme when it changes
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });

    // Apply initial theme
    this.applyTheme(this.isDarkMode());
  }

  toggleTheme() {
    this.isDarkMode.update(mode => !mode);
    localStorage.setItem(this.DARK_MODE_KEY, String(this.isDarkMode()));
  }

  private applyTheme(isDark: boolean) {
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (isDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }
}


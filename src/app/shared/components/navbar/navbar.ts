import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  
  mobileMenuOpen = signal(false);

  get currentUser() {
    return this.authService.currentUser();
  }

  get isAuthenticated() {
    return !!this.authService.token;
  }

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  ngOnInit() {
    // Toggle mobile menu
    if (typeof document !== 'undefined') {
      const button = document.getElementById('mobile-menu-button');
      const menu = document.getElementById('mobile-menu');
      
      if (button && menu) {
        button.addEventListener('click', () => {
          this.mobileMenuOpen.update(val => !val);
          menu.classList.toggle('hidden');
        });
      }
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(val => !val);
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }
}


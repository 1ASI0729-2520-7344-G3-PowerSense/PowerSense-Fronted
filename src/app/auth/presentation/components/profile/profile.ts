import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../application/auth.service';
import { User } from '../../../domain/model/user.entity';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;

  ngOnInit() {
    this.user = this.authService.currentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  getUserInitials(): string {
    return this.user ? this.user.getInitials() : '';
  }

  async logout() {
    await this.authService.logout();
  }

  formatDate(date: Date): string {  // ✅ Cambio: ahora recibe Date
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

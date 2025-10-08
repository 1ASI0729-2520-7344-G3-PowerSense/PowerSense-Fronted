import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-login-client',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    TranslateModule,
    NgIf,
    MatCard
  ],
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.css']
})
export class LoginClientComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

//Generic login funcionality to api, turn off only for dev
  /*
  onLogin(): void {
    this.http.get<any[]>('http://localhost:3000/registers').subscribe({
      next: users => {
        const foundUser = users.find(
          user => user.email === this.email && user.password === this.password
        );
        if (foundUser) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Correo o contraseña incorrectos';
        }
      },
      error: err => {
        console.error('Error al obtener usuarios:', err);
        this.errorMessage = 'Error del servidor. Intenta más tarde.';
      }
    });
  }*/
  onLogin(): void {
    if (this.email && this.password) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Por favor completa todos los campos.';
    }
  }

}

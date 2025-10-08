
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {MatCard} from '@angular/material/card';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    TranslateModule,
    MatCard,
    NgIf
  ],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})
export class RegisterClientComponent {
  name: string='';
  email:string='';
  password:string='';
  constructor(private router: Router, private http: HttpClient) {}

  onRegister(): void {
    const loginData = {
      name: this.name,
      email: this.email,
      password: this.password,
      timestamp: new Date(),
    };

    this.http.post('http://localhost:3000/registers', loginData).subscribe({
      next: () => {
        this.router.navigate(['/login/customer']);
      },
      error: err => {
        console.error('Error guardando en el register:', err);
      }
    });
  }
}

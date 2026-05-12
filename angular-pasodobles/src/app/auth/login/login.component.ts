import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Inyectamos las herramientas que necesitamos
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables vinculadas al formulario
  credentials = {
    email: '',
    password: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit() {
  this.isLoading = true;
  this.errorMessage = ''; 

  this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Login exitoso', res);
        this.router.navigate(['/admin/pasodobles']);
      },
      error: (err) => {
        
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
      }
    });
  }
}
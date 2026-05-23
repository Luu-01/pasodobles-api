import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData = {
    name: '',
    email: '',
    password: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        this.router.navigate(['pasodobles']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Error en el registro. Comprueba los datos.';
      }
    });
  }
}
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

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

  onSubmit(form?: NgForm) {
    this.errorMessage = '';

    if (form?.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.register(this.userData).subscribe({
      next: (res) => {
        console.log('Registro exitoso', res);
        this.isLoading = false;
        this.router.navigate(['pasodobles']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = this.getRegisterErrorMessage(err);
      }
    });
  }

  private getRegisterErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 422) {
      const errors = err.error?.errors as Record<string, string[]> | undefined;
      const firstValidationError = errors ? Object.values(errors).flat()[0] : null;

      return firstValidationError || err.error?.message || 'Revisa los datos del formulario.';
    }

    return err.error?.message || 'Error en el registro. Comprueba los datos.';
  }
}

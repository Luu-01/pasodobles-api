import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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
      this.cdr.markForCheck();
      return;
    }

    if (!this.hasValidEmailDomain(this.userData.email)) {
      this.errorMessage = 'Introduce una dirección de correo válida.';
      this.isLoading = false;
      const emailControl = form?.controls['email'];
      emailControl?.setErrors({
        ...emailControl.errors,
        invalidDomain: true,
      });

emailControl?.markAsTouched();
      this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      }
    });
  }

  private hasValidEmailDomain(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  private getRegisterErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 422) {
      const errors = err.error?.errors as Record<string, string[]> | undefined;

      // Laravel returns validation errors grouped by field. When the backend rejects
      // the email format, keep the UI message stable and user-facing instead of
      // exposing the raw API validation text.
      if (errors?.['email']?.length) {
        return 'Introduce una dirección de correo válida.';
      }

      const firstValidationError = errors ? Object.values(errors).flat()[0] : null;

      return firstValidationError || err.error?.message || 'Revisa los datos del formulario.';
    }

    return err.error?.message || 'Error en el registro. Comprueba los datos.';
  }
}

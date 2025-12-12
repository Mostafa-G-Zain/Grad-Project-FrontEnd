import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { IRegisterRequest } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-customer.html',
  styleUrl: './register-customer.scss',
})
export class RegisterCustomerComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    nationalId: ['', Validators.required],
    address: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });

  loading = false;
  error: string | null = null;

  register() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.error = null;

  this.auth.registerCustomer(this.registerForm.value as IRegisterRequest)
    .subscribe({
      next: (res) => {
        this.loading = false;
        alert('Customer registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.log('FULL ERROR:', err);

        const errorsObj = err.error?.errors as Record<string, string[]> | undefined;

        if (errorsObj) {
          Object.entries(errorsObj).forEach(([field, messages]) => {
            console.log(`Field: ${field}`, 'Messages:', messages);
          });

          const allMessages = Object.values(errorsObj).flat();

          this.error = allMessages.join('\n');
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Registration failed, please check your data.';
        }
      }
    });
}

}

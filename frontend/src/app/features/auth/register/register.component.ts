import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  passwordComplexityValidator,
  passwordMatchValidator,
} from '../../../shared/validators/password.validators';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { NgClass } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import {
  ErrorResponse,
  IRegisterData,
  ValidationErrorResponse,
} from '../../../shared/interfaces/auth.interface';
import { generateCryptoData } from '../../../utils/crypto.utils';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  isErrorResponse,
  isValidationErrorResponse,
  isRegisterResponse,
} from '../../../utils/authResponse.type.guards';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { HTTP_STATUS } from '../../../core/constants/http.status';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    CardModule,
    NgClass,
    PasswordModule,
    ToastModule,
    RouterLink,
    ToastComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private fb: FormBuilder, private toast: ToastService) {}

  ngOnInit(): void {
    this.initForm();
  }

  resetForm() {
    this.submitted = false;
    this.registerForm.markAsUntouched();
    this.registerForm.markAsPristine();
    this.registerForm.reset();
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const cryptoData = await generateCryptoData(this.password?.value);
    const formData: IRegisterData = {
      ...this.registerForm.value,
      ...cryptoData,
    };

    this.authService.register(formData).subscribe({
      next: (res) => {
        if (isRegisterResponse(res)) {
          this.resetForm();
          this.authService.setComingFrom('register');
          this.router.navigate(['/login']);
        } else {
          console.error('Unexpected response:', res);
          this.toast.showError('Error', 'Unexpected response from server');
        }
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ErrorResponse | ValidationErrorResponse;

        if (isErrorResponse(apiError)) {
          console.error(' Error:', apiError.message);
          if (err.status === HTTP_STATUS.BAD_REQUEST.code) {
            this.toast.showWarn('Warning', apiError.message);
          } else {
            this.toast.showError('Error', apiError.message);
          }
        }
        if (isValidationErrorResponse(apiError)) {
          console.error(
            `Validation failed at ${apiError.path}: ${apiError.message}`
          );
          this.toast.showError('Error', apiError.message);
        }
        this.resetForm();
      },
    });
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/),
          ],
        ],
        password: ['', [Validators.required, passwordComplexityValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator() }
    );
  }

  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  ngOnDestroy(): void {
    this.toast.clear();
  }
}

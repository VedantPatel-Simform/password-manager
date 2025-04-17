import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { passwordComplexityValidator } from '../../../shared/validators/password.validators';
import { NgClass } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import {
  ErrorResponse,
  ValidationErrorResponse,
} from '../../../shared/interfaces/auth.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  isLoginResponse,
  isErrorResponse,
  isValidationErrorResponse,
} from '../../../utils/authResponse.type.guards';
import { ILoginData } from '../../../shared/interfaces/auth.interface';
import {
  decryptWithBase64Key,
  generateBase64KeyFromPasswordAndSalt,
} from '../../../utils/crypto.utils';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { KeyStorageService } from '../../../core/services/User/key-storage.service';
@Component({
  selector: 'app-login',
  imports: [
    ToastModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    ToastComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  showPassword = false;
  loginForm!: FormGroup;
  submitted = false;
  router = inject(Router);
  keyService = inject(KeyStorageService);

  // Inject ToastService instead of MessageService
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService // Inject ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.authService.getComingFrom() === 'register') {
      this.toastService.showSuccess('Success', 'Successfully Registered');
    } else if (this.authService.getComingFrom() === 'dashboard') {
      this.toastService.showSuccess('Success', 'Successfully Logged out');
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log('Form Invalid');
      return;
    }
    const formData: ILoginData = this.loginForm.value;
    this.authService.login(formData).subscribe({
      next: async (res) => {
        if (isLoginResponse(res)) {
          console.log('Login successful', res.user);

          // Show success message using ToastService
          this.toastService.showSuccess('success', res.message);

          const userEncKey = await generateBase64KeyFromPasswordAndSalt(
            this.password?.value,
            res.user.salt
          );

          const userDek = await decryptWithBase64Key(userEncKey, res.user.dek);
          const userPrivateKey = await decryptWithBase64Key(
            userDek,
            res.user.rsa.privateKey
          );

          this.keyService.setDekKey(userDek);
          this.keyService.setEncryptionKey(userEncKey);
          this.keyService.setPrivateKey(userPrivateKey);
          this.keyService.setPublicKey(res.user.rsa.publicKey);
          this.authService.setComingFrom('login');
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Unexpected response format:', res);
          // Show error message using ToastService
          this.toastService.showError(
            'error',
            'Unexpected response from server'
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        const apiError = error.error as ErrorResponse | ValidationErrorResponse;
        if (isErrorResponse(apiError)) {
          console.error('Login failed:', error.error);
          // Show error message using ToastService
          this.toastService.showError('error', apiError.message);
        } else if (isValidationErrorResponse(apiError)) {
          console.error('Validation error:', apiError);
          // Show validation error message using ToastService
          this.toastService.showError('error', apiError.message);
        }
      },
    });
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordComplexityValidator()]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}

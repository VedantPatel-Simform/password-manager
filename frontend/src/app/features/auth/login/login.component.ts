import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ILoginData } from '../../../shared/interfaces/auth.interface';
import {
  decryptWithBase64Key,
  generateBase64KeyFromPasswordAndSalt,
} from '../../../utils/crypto.utils';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ToastModule, ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent implements OnInit, AfterViewInit {
  showPassword = false;
  loginForm!: FormGroup;
  submitted = false;
  router = inject(Router);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.authService.isRegistered()) {
      console.log('is registered');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully Registered',
      });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log('Form Invalid');
      // this.submitted = true;
      return;
    }
    const formData: ILoginData = this.loginForm.value;
    this.authService.login(formData).subscribe({
      next: async (res) => {
        if (isLoginResponse(res)) {
          this.authService.setLoggedIn(true);
          console.log('Login successful', res.user);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          const userEncKey = await generateBase64KeyFromPasswordAndSalt(
            this.password?.value,
            res.user.salt
          );

          const userDek = await decryptWithBase64Key(userEncKey, res.user.dek);
          const userPrivateKey = await decryptWithBase64Key(
            userDek,
            res.user.rsa.privateKey
          );
          console.log('User Public RSA:', res.user.rsa.publicKey);
          console.log('User Private RSA:', userPrivateKey);
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Unexpected response format:', res);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unexpected response from server',
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        const apiError = error.error as ErrorResponse | ValidationErrorResponse;
        if (isErrorResponse(apiError)) {
          console.error('Login failed:', error.error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${apiError.statusCode}: ${apiError.message}`,
          });
        } else if (isValidationErrorResponse(apiError)) {
          console.error('Validation error:', apiError);
          this.messageService.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: `${apiError.error}: ${apiError.msg}`,
          });
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
}

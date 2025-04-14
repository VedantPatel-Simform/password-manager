import { Component, inject, OnInit } from '@angular/core';
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
  isLoginResponse,
  isErrorResponse,
  isValidationErrorResponse,
  isRegisterResponse,
} from '../../../utils/authResponse.type.guards';
import { MessageService } from 'primeng/api';

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
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.log('Form Invalid');
      return;
    }

    const cryptoData = await generateCryptoData(this.password?.value);
    const formData: IRegisterData = {
      ...this.registerForm.value,
      ...cryptoData,
    };

    this.authService.register(formData).subscribe({
      next: (res) => {
        console.log(res);
        if (isRegisterResponse(res)) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.submitted = false;
          this.registerForm.markAsUntouched();
          this.registerForm.markAsPristine();
          this.registerForm.reset();
        } else {
          console.error('Unexpected response:', res);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unexpected response from server',
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ErrorResponse | ValidationErrorResponse;

        if (isErrorResponse(apiError)) {
          console.error(' Error:', apiError.message);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: apiError.message,
          });
        }
        if (isValidationErrorResponse(apiError)) {
          console.error(
            `Validation failed at ${apiError.path}: ${apiError.msg}`
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: apiError.msg,
          });
        }
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
}

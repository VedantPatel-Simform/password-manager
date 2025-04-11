import { Component, OnInit } from '@angular/core';
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
import {
  decryptWithBase64Key,
  encryptWithBase64Key,
  generateBase64KeyFromPassword,
  generateBase64KeyFromPasswordAndSalt,
  generateRandomBase64AesKey,
  generateRSAKeyPair,
} from '../../../utils/crypto.utils';
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
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  registerForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  async generateCryptoData(password: string) {
    const { key, salt } = await generateBase64KeyFromPassword(password);
    const dek = generateRandomBase64AesKey();
    const encryptedDek = await encryptWithBase64Key(key, dek);

    const rsa = await generateRSAKeyPair();

    console.log('key from password: ', key);
    console.log('salt from password: ', salt);
    console.log('encrypted DEK: ', encryptedDek);
    console.log('rsa key pair: ', rsa);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log('Form Values:', this.registerForm.value);
      this.generateCryptoData(this.password?.value);
    } else {
      console.log('Form Invalid');
      this.registerForm.markAllAsTouched(); // optional: shows errors
    }
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, passwordComplexityValidator()]],
        confirmPassword: [
          '',
          [Validators.required, passwordComplexityValidator()],
        ],
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

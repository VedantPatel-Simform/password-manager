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
import { NgClass, NgIf } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ICryptoData } from '../../../shared/interfaces/crypto-data.interface';
import { IRegisterData } from '../../../shared/interfaces/auth.interface';
import {
  encryptWithBase64Key,
  generateBase64KeyFromPassword,
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
  registerForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {}

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

    console.log('Form Values:', this.registerForm.value);
    const cryptoData = await this.generateCryptoData(this.password?.value);
    const formData: IRegisterData = {
      ...this.registerForm.value,
      ...cryptoData,
    };
    console.log(formData);
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, passwordComplexityValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator() }
    );
  }

  async generateCryptoData(password: string): Promise<ICryptoData> {
    const { key, salt } = await generateBase64KeyFromPassword(password);
    const dek = generateRandomBase64AesKey();
    const encryptedDek = await encryptWithBase64Key(key, dek);

    const rsa = await generateRSAKeyPair();

    const encryptedPrivateKey = await encryptWithBase64Key(
      dek,
      rsa.privateKeyPem
    );

    return {
      salt,
      dek: { cipherText: encryptedDek.cipherText, iv: encryptedDek.iv },
      rsa: {
        publicKey: rsa.publicKeyPem,
        privateKey: encryptedPrivateKey,
      },
    };
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

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { PasswordService } from '../../core/services/password/password-service.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-add-password',
  templateUrl: './add-password.component.html',
  styleUrls: ['./add-password.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    FormsModule,
    FloatLabelModule,
    Select,
    InputTextModule,
  ],
})
export class AddPasswordComponent {
  passwordForm: FormGroup;
  showGenerator = false;
  generatedPassword = '';
  passwordVisible = false;
  categoryOptions = [
    { label: 'Social Media', value: 'social_media' },
    { label: 'Work & Professional', value: 'work_professional' },
    { label: 'Banking & Finance', value: 'banking_finance' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Personal', value: 'personal' },
    { label: 'Education & Learning', value: 'education' },
    { label: 'Shopping & E-commerce', value: 'shopping_ecommerce' },
    { label: 'Health & Fitness', value: 'health_fitness' },
    { label: 'Travel & Tourism', value: 'travel_tourism' },
    { label: 'Other', value: 'other' },
  ];

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private toastService: ToastService
  ) {
    this.passwordForm = this.fb.group({
      website: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      category: ['', Validators.required],
      notes: [''],
    });
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.toastService.showError(
        'Error',
        'Please fill out all required fields'
      );
      return;
    }

    const formData = this.passwordForm.value;

    this.passwordService.createPasswordApi(formData).subscribe({
      next: (res) => {
        this.toastService.showSuccess(
          'Created',
          'Password created successfully'
        );
        console.log(res);
        this.passwordForm.reset();
      },
      error: (err) => {
        this.toastService.showError('Error', err.message);
      },
    });
  }

  generatePassword(): void {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    this.generatedPassword = Array.from({ length: 16 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  useGeneratedPassword(): void {
    this.passwordForm.get('password')?.setValue(this.generatedPassword);
    this.showGenerator = false;
  }

  get website() {
    return this.passwordForm.get('website');
  }

  get userName() {
    return this.passwordForm.get('userName');
  }

  get email() {
    return this.passwordForm.get('email');
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get category() {
    return this.passwordForm.get('category');
  }

  get notes() {
    return this.passwordForm.get('notes');
  }
}

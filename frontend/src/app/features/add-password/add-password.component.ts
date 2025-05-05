import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  NgModel,
} from '@angular/forms';
import { PasswordService } from '../../core/services/password/password-service.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModalComponent } from '../../shared/components/password-modal/password-modal.component';
import { PasswordBody } from '../../shared/interfaces/password.interface';

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
    PasswordModalComponent,
  ],
})
export class AddPasswordComponent {
  passwordForm: FormGroup;
  showGenerator = false;
  generatedPassword = '';
  passwordVisible = false;
  selectedTab: 'password' | 'passphrase' = 'password';
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

  websiteRegex =
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

  @ViewChild('passwordModal') passwordModal!: PasswordModalComponent;

  setPassword() {
    this.password?.setValue(this.passwordModal.getPassword());
    this.visible = false;
  }

  visible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private toastService: ToastService
  ) {
    this.passwordForm = this.fb.group({
      website: [
        '',
        [Validators.required, Validators.pattern(this.websiteRegex)],
      ],
      userName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/),
        ],
      ],
      password: ['', Validators.required],
      category: ['', Validators.required],
      notes: [''],
    });
  }

  showDialog() {
    this.visible = true;
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.toastService.showError(
        'Error',
        'Please fill out all required fields'
      );
      return;
    }

    const formData = this.passwordForm.value as PasswordBody;
    this.passwordService.createPasswordApi(formData).subscribe({
      next: (res) => {
        this.toastService.showSuccess(
          'Created',
          'Password created successfully'
        );
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

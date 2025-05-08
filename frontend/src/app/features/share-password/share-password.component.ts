import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ToastService } from '../../core/services/toast/toast.service';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModalComponent } from '../../shared/components/password-modal/password-modal.component';
import { SharedPasswordBody } from '../../shared/interfaces/PasswordShare.interface';
import { DatePicker } from 'primeng/datepicker';
import { PasswordSentService } from '../../core/services/password/password-sent.service';

@Component({
  selector: 'app-share-password',
  templateUrl: './share-password.component.html',
  styleUrls: ['./share-password.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    FormsModule,
    FloatLabelModule,
    Select,
    InputTextModule,
    PasswordModalComponent,
    DatePicker,
  ],
})
export class SharePasswordComponent {
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

  minDate = new Date();

  websiteRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/;

  @ViewChild('passwordModal') passwordModal!: PasswordModalComponent;

  setPassword() {
    this.password?.setValue(this.passwordModal.getPassword());
    this.visible = false;
  }

  visible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sharePasswordService: PasswordSentService,
    private toastService: ToastService
  ) {
    this.passwordForm = this.fb.group({
      receiverMail: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/),
        ],
      ],
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
      expireDate: [''],
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

    const formData = this.passwordForm.value as SharedPasswordBody;
    this.sharePasswordService.sendPassword(formData).subscribe({
      next: (value) => {
        console.log(value);
        this.toastService.showSuccess('Successfully Shared', value.message);
      },
      error: (err: any) => {
        this.toastService.showError('Error', err.toString());
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

  get receiverMail() {
    return this.passwordForm.get('receiverMail');
  }

  get expireDate() {
    return this.passwordForm.get('expireDate');
  }
}

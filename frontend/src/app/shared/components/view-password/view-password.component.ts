import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../../../core/services/password/password-service.service';
import {
  CategoryValue,
  IDecryptedPassword,
  IPassword,
  PasswordBody,
} from '../../interfaces/password.interface';
import { KeyStorageService } from '../../../core/services/User/key-storage.service';
import { decryptWithBase64Key } from '../../../utils/crypto.utils';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModalComponent } from '../password-modal/password-modal.component';
import { ToastService } from '../../../core/services/toast/toast.service';
import { categoryOptions } from '../../../core/constants/category.options';
@Component({
  selector: 'app-view-password',
  imports: [
    ReactiveFormsModule,
    Dialog,
    FormsModule,
    FloatLabelModule,
    Select,
    InputTextModule,
    PasswordModalComponent,
  ],
  templateUrl: './view-password.component.html',
  styleUrl: './view-password.component.css',
})
export class ViewPasswordComponent implements OnInit, AfterViewInit {
  activatedRouter = inject(ActivatedRoute);
  passwordService = inject(PasswordService);
  keyService = inject(KeyStorageService);
  fb = inject(FormBuilder);
  dek = this.keyService.getDekKey() as string;
  toastService = inject(ToastService);
  localPassword!: IPassword;
  localDecryptedPassword!: IDecryptedPassword;
  passwordId!: string;
  passwordForm!: FormGroup;
  router = inject(Router);
  websiteRegex =
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

  showGenerator = false;
  generatedPassword = '';
  passwordVisible = false;
  selectedTab: 'password' | 'passphrase' = 'password';
  categoryOptions = categoryOptions.filter((val) => val.value !== 'all'); // to remove the all lable from the category as it is only for dashboard

  @ViewChild('passwordModal') passwordModal!: PasswordModalComponent;

  ngOnInit() {
    this.passwordId = this.activatedRouter.snapshot.params['id'];
    this.passwordService
      .getPasswordApi(this.passwordId)
      .subscribe(async (res) => {
        if (res.password.deleted) {
          this.router.navigate(['/dashboard/passwords']);
        } else {
          this.localPassword = res.password;
          const decryptedPassword = await decryptWithBase64Key(
            this.dek,
            this.localPassword.password
          );

          const decryptedNotes = this.localPassword.notes
            ? await decryptWithBase64Key(this.dek, this.localPassword.notes)
            : '';
          this.localDecryptedPassword = {
            ...this.localPassword,
            password: decryptedPassword,
            notes: decryptedNotes,
          };

          this.initForm();
        }
      });
  }

  ngAfterViewInit(): void {}

  initForm() {
    this.passwordForm = this.fb.group({
      website: [
        `${this.localDecryptedPassword.website || ''}`,
        [Validators.required, Validators.pattern(this.websiteRegex)],
      ],
      userName: [this.localDecryptedPassword.userName, Validators.required],
      email: [
        this.localDecryptedPassword.email,
        [
          Validators.required,
          Validators.pattern(/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/),
        ],
      ],
      password: [
        `${this.localDecryptedPassword.password}`,
        Validators.required,
      ],
      category: [
        this.categoryOptions.find(
          (val) => val.value === this.localDecryptedPassword.category
        ),
        [Validators.required],
      ],
      notes: [`${this.localDecryptedPassword.notes}`],
    });
  }

  onDelete(id: string) {
    this.passwordService.deletePasswordApi(id).subscribe({
      next: (value) => {
        this.toastService.showSuccess('Success', value.message);
        this.router.navigate(['/dashboard/passwords']);
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

  setPassword() {
    this.password?.setValue(this.passwordModal.getPassword());
    this.visible = false;
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

    const formData: PasswordBody & { _id: string } = this.passwordForm.value;
    formData._id = this.localDecryptedPassword._id;
    this.passwordService.editPasswordApi(formData).subscribe({
      next: (res) => {
        this.toastService.showSuccess(
          'Created',
          'Password Updated successfully'
        );
        this.router.navigate(['/dashboard/passwords']);
      },
      error: (err) => {
        this.toastService.showError('Error', err.message);
      },
    });
  }

  visible: boolean = false;

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

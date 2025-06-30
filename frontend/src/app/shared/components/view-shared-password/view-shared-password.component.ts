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
import {
  decryptWithBase64Key,
  decryptWithPrivateKey,
} from '../../../utils/crypto.utils';
import { DatePicker } from 'primeng/datepicker';
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
import { NgClass } from '@angular/common';
import { PasswordSentService } from '../../../core/services/password/password-sent.service';
import {
  IDecryptedPasswordShare,
  IPasswordShare,
  SharedPasswordBody,
} from '../../interfaces/PasswordShare.interface';

@Component({
  selector: 'app-view-shared-password',
  templateUrl: './view-shared-password.component.html',
  styleUrl: './view-shared-password.component.css',
  imports: [
    ReactiveFormsModule,
    Dialog,
    FormsModule,
    FloatLabelModule,
    Select,
    InputTextModule,
    PasswordModalComponent,
    NgClass,
    DatePicker,
  ],
})
export class ViewSharedPasswordComponent {
  activatedRouter = inject(ActivatedRoute);
  passwordService = inject(PasswordSentService);
  keyService = inject(KeyStorageService);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  router = inject(Router);

  privateKey = this.keyService.getPrivateKey()!;
  passwordId!: string;
  passwordForm!: FormGroup;
  localPassword!: IPasswordShare;
  localDecryptedPassword!: IDecryptedPasswordShare;
  initialFormValue!: IDecryptedPassword;

  websiteRegex =
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

  categoryOptions = categoryOptions.filter((val) => val.value !== 'all');
  minDate = new Date();

  showGenerator = false;
  generatedPassword = '';
  passwordVisible = false;
  selectedTab: 'password' | 'passphrase' = 'password';
  visible = false;
  deleteDialogVisible = false;
  formChanged = false;

  @ViewChild('passwordModal') passwordModal!: PasswordModalComponent;

  ngOnInit() {
    this.passwordId = this.activatedRouter.snapshot.paramMap.get('id')!;

    this.passwordService
      .getPasswordDetails(this.passwordId)
      .subscribe(async (res) => {
        this.localPassword = res.password;

        const decryptedPasswordPEK = await decryptWithPrivateKey(
          this.privateKey,
          this.localPassword.senderPublicEncPEK
        );

        const decryptedPassword = await decryptWithBase64Key(
          decryptedPasswordPEK,
          res.password.password
        );

        const decryptedNotes = this.localPassword.notes
          ? await decryptWithBase64Key(
              decryptedPasswordPEK,
              this.localPassword.notes
            )
          : '';

        this.localDecryptedPassword = {
          ...this.localPassword,
          password: decryptedPassword,
          notes: decryptedNotes,
        };
        console.log(new Date(this.localDecryptedPassword.expireDate!));
        this.initForm();
      });
  }

  initForm() {
    this.passwordForm = this.fb.group({
      website: [
        this.localDecryptedPassword.website || '',
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
      password: [this.localDecryptedPassword.password, Validators.required],
      category: [
        this.categoryOptions.find(
          (val) => val.value === this.localDecryptedPassword.category
        ),
        Validators.required,
      ],
      notes: [this.localDecryptedPassword.notes],
      expireDate: [new Date(this.localDecryptedPassword.expireDate!)],
      receiverMail: [
        {
          value: this.localDecryptedPassword.receiverMail,
          disabled: true,
        },
      ],
    });

    this.initialFormValue = this.passwordForm.getRawValue();
    console.log(this.initialFormValue);
    this.passwordForm.valueChanges.subscribe((currentValue) => {
      this.formChanged = Object.keys(currentValue).some((key) => {
        const initialVal =
          this.initialFormValue[key as keyof IDecryptedPassword];
        const currentVal = currentValue[key as keyof IDecryptedPassword];

        if (key === 'category') {
          return initialVal !== this.category?.value;
        }

        return initialVal !== currentVal;
      });
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
    this.password?.setValue(this.generatedPassword);
    this.showGenerator = false;
  }

  setPassword() {
    this.password?.setValue(this.passwordModal.getPassword());
    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }

  openDeleteDialog() {
    this.deleteDialogVisible = true;
  }

  cancelDelete() {
    this.deleteDialogVisible = false;
  }

  confirmDelete() {
    this.passwordService.deletePasswordApi(this.passwordId).subscribe({
      next: (value) => {
        this.toastService.showSuccess('Success', value.message);
        this.router.navigate(['/dashboard/shared/sent']);
      },
      error: (err) => {
        this.toastService.showError('Error', err.message);
      },
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

    const formData: SharedPasswordBody & { _id: string } =
      this.passwordForm.value;
    formData._id = this.localDecryptedPassword._id;

    console.log(formData);

    // Uncomment when endpoint is ready
    // this.passwordService.editPasswordApi(formData).subscribe({
    //   next: (res) => {
    //     this.toastService.showSuccess('Created', 'Password Updated successfully');
    //     this.router.navigate(['/dashboard/passwords']);
    //   },
    //   error: (err) => {
    //     this.toastService.showError('Error', err.message);
    //   },
    // });
  }

  // Getters for form controls
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

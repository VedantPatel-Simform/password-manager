import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDecryptedPassword } from '../../interfaces/password.interface';
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
import { DatePipe, LocationStrategy, NgClass } from '@angular/common';
import { PasswordSentService } from '../../../core/services/password/password-sent.service';
import {
  IDecryptedPasswordShare,
  IEditSharedPasswordBody,
  IPasswordShare,
  SharedPasswordBody,
} from '../../interfaces/PasswordShare.interface';
import { mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { IError } from '../../interfaces/error.interface';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule,
    DatePipe,
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
  passwordPEK!: string;
  websiteRegex =
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

  categoryOptions = categoryOptions.filter((val) => val.value !== 'all');
  minDate = new Date();
  locationStrategy = inject(LocationStrategy);
  showGenerator = false;
  generatedPassword = '';
  passwordVisible = false;
  selectedTab: 'password' | 'passphrase' = 'password';
  visible = false;
  deleteDialogVisible = false;
  formChanged = false;
  sender = true;
  @ViewChild('passwordModal') passwordModal!: PasswordModalComponent;

  ngOnInit() {
    this.passwordId = this.activatedRouter.snapshot.paramMap.get('id')!;
    const state = this.locationStrategy.getState() as {
      sender: boolean;
    };
    this.sender = state.sender;
    this.passwordService
      .getPasswordDetails(this.passwordId)
      .subscribe(async (res) => {
        this.localPassword = res.password;

        this.passwordPEK = await decryptWithPrivateKey(
          this.privateKey,
          this.sender
            ? this.localPassword.senderPublicEncPEK
            : this.localPassword.receiverPublicEncPEK
        );

        const decryptedPassword = await decryptWithBase64Key(
          this.passwordPEK,
          res.password.password
        );

        const decryptedNotes = this.localPassword.notes
          ? await decryptWithBase64Key(
              this.passwordPEK,
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
      expireDate: [
        this.localDecryptedPassword.expireDate
          ? new Date(this.localDecryptedPassword.expireDate)
          : null,
      ],
      receiverMail: [this.localDecryptedPassword.receiverMail],
      senderMail: [this.localDecryptedPassword.senderMail],
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

    const formData: Required<SharedPasswordBody> & {
      _id: string;
    } = this.passwordForm.value;
    formData._id = this.localDecryptedPassword._id;

    const formBody: IEditSharedPasswordBody = {
      senderId: this.localDecryptedPassword.senderId,
      senderMail: this.localDecryptedPassword.senderMail,
      receiverId: this.localDecryptedPassword.receiverId,
      receiverMail: this.localDecryptedPassword.receiverMail,
      website: formData.website,
      email: formData.email,
      userName: formData.userName,
      category: formData.category.value,
      password: formData.password,
      notes: formData.notes,
      _id: this.localDecryptedPassword._id,
      expireDate: formData.expireDate,
    };
    this.passwordService
      .editPasswordApi(
        formBody,
        this.passwordPEK,
        this.localDecryptedPassword.senderPublicEncPEK
      )
      .pipe(mergeMap((res) => res))
      .subscribe({
        next: (res) => {
          this.toastService.showSuccess('Success', 'Password Updated');
          this.router.navigate(['dashboard/shared/sent']);
        },
        error: (err: HttpErrorResponse) => {
          const error: IError = err.error;
          this.toastService.showError('Error', error.message);
        },
      });
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

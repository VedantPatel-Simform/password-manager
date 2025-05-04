import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// PrimeNG Modules
import { DropdownModule, Dropdown, DropdownItem } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

// RxJS
import { forkJoin, from, of, Subscription, switchMap } from 'rxjs';

// Project Services and Utils
import { PasswordService } from '../../core/services/password/password-service.service';
import { KeyStorageService } from '../../core/services/User/key-storage.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { decryptWithBase64Key } from '../../utils/crypto.utils';

// Constants and Interfaces
import { categoryOptions } from '../../core/constants/category.options';
import { sortOptions } from '../../core/constants/sort.options';
import {
  IPassword,
  IDecryptedPassword,
  IEncryptedField,
} from '../../shared/interfaces/password.interface';

@Component({
  selector: 'app-password-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputText,
    InputGroupModule,
    InputGroupAddonModule,
    NgClass,
  ],
  templateUrl: './password-dashboard.component.html',
  styleUrl: './password-dashboard.component.css',
})
export class PasswordDashboardComponent implements OnDestroy {
  searchTerm = '';
  selectedCategory = 'all';
  sortOption = 'created';
  loading = true;

  categoryOptions = categoryOptions;
  sortOptions = sortOptions;

  passwords: IPassword[] = [];
  decryptedPasswords: (IDecryptedPassword & { toggle: boolean })[] = [];
  filteredPasswordList: (IDecryptedPassword & { toggle: boolean })[] = [];

  // Subscriptions
  passwordApiSub!: Subscription;
  passwordListSub!: Subscription;

  // Injected services
  private passwordService = inject(PasswordService);
  private keyService = inject(KeyStorageService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  constructor() {
    this.passwordApiSub = this.passwordService.getPasswordsApi().subscribe({
      next: ({ passwords }) => {
        this.passwordService.setPasswords(passwords);
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showError('Something went wrong', err.message);
      },
    });
    this.subscribeToPasswordChange();
  }

  private subscribeToPasswordChange(): void {
    this.passwordListSub = this.passwordService.$password
      .pipe(
        switchMap((value) => {
          if (value.length === 0) {
            return of([] as (IDecryptedPassword & { toggle: boolean })[]);
          }
          const decryptedPasswordsObservable = value.map((p) =>
            from(this.decryptPassword(p))
          );
          return forkJoin(decryptedPasswordsObservable);
        })
      )
      .subscribe((value) => {
        console.log(value);

        this.decryptedPasswords = value;
      });
  }

  async decryptPassword(
    password: IPassword
  ): Promise<IDecryptedPassword & { toggle: boolean }> {
    const key = this.keyService.getDekKey()!;
    const decryptedPassword = await decryptWithBase64Key(
      key,
      password.password
    );
    const decryptedNotes = password.notes
      ? await decryptWithBase64Key(key, password.notes)
      : '';
    return {
      ...password,
      password: decryptedPassword,
      notes: decryptedNotes,
      toggle: false,
    };
  }

  get filteredPasswords(): (IDecryptedPassword & { toggle: boolean })[] {
    let filtered = [...this.decryptedPasswords].filter((p) => !p.deleted);

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.website.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.userName.toLowerCase().includes(term)
      );
    }

    if (this.sortOption === 'created') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (this.sortOption === 'updated') {
      filtered.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return filtered;
  }

  copyField(password: string, type: 'email' | 'password') {
    if (type === 'email') {
      navigator.clipboard.writeText(password);
      this.toastService.showSuccess('Copied', 'Email Copied to clipboard');
      return;
    }
    if (type === 'password') {
      navigator.clipboard.writeText(password);
      this.toastService.showSuccess('Copied', 'Password Copied to clipboard');
      return;
    }
  }

  async viewPassword(password: IEncryptedField): Promise<void> {
    const key = this.keyService.getDekKey();
    const decrypted = await decryptWithBase64Key(key as string, password);
    alert(`Password: ${decrypted}`);
  }

  getDomainFromUrl(url: string): string {
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      return new URL(url).hostname;
    } catch {
      console.error('Invalid URL:', url);
      return '';
    }
  }

  viewDetails(password: IDecryptedPassword & { toggle: boolean }): void {
    this.router.navigate(['/dashboard/passwords/', password._id]);
  }

  ngOnDestroy(): void {
    this.passwordApiSub.unsubscribe();
    this.passwordListSub.unsubscribe();
  }
}

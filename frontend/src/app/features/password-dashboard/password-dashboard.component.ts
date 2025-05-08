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
import {
  PasswordSortFn,
  sortByDateAsc,
  sortByDateDesc,
  sortByUpdatedAsc,
  sortByUpdatedDesc,
} from '../../utils/sortFn.utils';
import { SearchComponentComponent } from '../../shared/components/search-component/search-component.component';
import { DecryptedPassword } from '../../utils/sortFn.utils';

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
    SearchComponentComponent,
  ],
  templateUrl: './password-dashboard.component.html',
  styleUrl: './password-dashboard.component.css',
})
export class PasswordDashboardComponent implements OnDestroy {
  searchTerm = '';
  selectedCategory = 'all';
  sortOption = 'created_desc';
  loading = true;

  categoryOptions = categoryOptions;
  sortOptions = sortOptions;
  sortFn: PasswordSortFn<DecryptedPassword> = sortByDateDesc;

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

  getDomainFromUrl(url: string): { hostname: string; pathname: string } {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return {
      hostname: new URL(url).hostname,
      pathname: new URL(url).hostname + '?token=pk_FceobK6OTIKRrKmZpV7KBQ',
    };
  }

  viewDetails(password: IDecryptedPassword & { toggle: boolean }): void {
    this.router.navigate(['/dashboard/passwords/', password._id]);
  }

  onSortChange(option: string) {
    if (option === 'created_asc') {
      this.sortFn = sortByDateAsc;
    } else if (option === 'created_desc') {
      this.sortFn = sortByDateDesc;
    } else if (option === 'updated_asc') {
      this.sortFn = sortByUpdatedAsc;
    } else {
      this.sortFn = sortByUpdatedDesc;
    }
  }

  ngOnDestroy(): void {
    this.passwordApiSub.unsubscribe();
    this.passwordListSub.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

// RxJS
import { forkJoin, from, of, Subscription, switchMap } from 'rxjs';

// Project Services and Utils
import { PasswordService } from '../../core/services/password/password-service.service';
import { KeyStorageService } from '../../core/services/User/key-storage.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { decryptWithBase64Key } from '../../utils/crypto.utils';

// Constants and Interfaces
import { categoryOptions } from '../../core/constants/category.options';
import {
  IPassword,
  IDecryptedPassword,
} from '../../shared/interfaces/password.interface';
import { SearchComponentComponent } from '../../shared/components/search-component/search-component.component';
import { sortByDaysAsc, sortByDaysDesc } from '../../utils/sortFn.utils';
import { Dialog } from 'primeng/dialog';

export type DeletedPassword = IDecryptedPassword & { daysLeft: number };

@Component({
  selector: 'app-recycle-bin',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputText,
    InputGroupModule,
    InputGroupAddonModule,
    NgClass,
    Dialog,
    SearchComponentComponent,
  ],
  standalone: true,
  templateUrl: './recycle-bin.component.html',
  styleUrl: './recycle-bin.component.css',
  providers: [ConfirmationService],
})
export class RecycleBinComponent implements OnInit, OnDestroy {
  deletedPasswords: DeletedPassword[] = [];
  passwordService = inject(PasswordService);
  keyService = inject(KeyStorageService);
  router = inject(Router);
  toastService = inject(ToastService);
  passwordListSub!: Subscription;

  filteredPasswords: DeletedPassword[] = [];

  searchTerm!: string;
  selectedCategory!: string;
  sortOption!: string;
  sortFn!: Function;

  sortOptions = [
    { label: 'Sort by Days Left (Ascending)', value: 'asc' },
    { label: 'Sort by Days Left (Descending)', value: 'desc' },
  ];

  categoryOptions = categoryOptions;
  loading = true;

  deleteDialogVisible: boolean = false;
  passwordIdToDelete: string | null = null;

  ngOnInit(): void {
    this.searchTerm = '';
    this.sortOption = 'asc';
    this.selectedCategory = 'all';
    this.sortFn = sortByDaysAsc;
    this.passwordService.getDeletedPasswordsApi().subscribe({
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
        this.deletedPasswords = value.map((p) => {
          return {
            ...p,
            daysLeft: this.getDaysRemaining(p.autoDeleteDate),
          };
        });
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

  get filteredDeletedPasswords() {
    return this.deletedPasswords.filter((p) => p.deleted);
  }

  openDeleteDialog(id: string) {
    this.passwordIdToDelete = id;
    this.deleteDialogVisible = true;
  }

  confirmDelete() {
    if (this.passwordIdToDelete) {
      this.deletePassword(this.passwordIdToDelete);
      this.passwordIdToDelete = null;
      this.deleteDialogVisible = false;
    }
  }

  cancelDelete() {
    this.passwordIdToDelete = null;
    this.deleteDialogVisible = false;
  }

  onSortChange(a: string) {
    if (a === 'asc') {
      this.sortFn = sortByDaysAsc;
    } else {
      this.sortFn = sortByDaysDesc;
    }
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

  restorePassword(password: DeletedPassword): void {
    this.passwordService.restorePasswordApi(password._id).subscribe((value) => {
      this.toastService.showSuccess('Restored', value.message);
      this.router.navigate(['/dashboard/passwords']);
    });
  }

  deletePassword(id: string) {
    this.passwordService.permenantDeletePassword(id).subscribe((result) => {
      this.toastService.showSuccess('Permenantly Deleted', result.message);
      this.deletedPasswords = this.deletedPasswords.filter((p) => p._id !== id);
    });
  }

  getDaysRemaining(autoDeleteDate?: Date): number {
    if (!autoDeleteDate) return -1; // Means no date or already deleted

    const now = new Date();
    const target = new Date(autoDeleteDate);

    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return daysRemaining;
  }

  ngOnDestroy(): void {
    this.passwordListSub.unsubscribe();
  }
}

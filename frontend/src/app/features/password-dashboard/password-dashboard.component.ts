import {
  Component,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Table, TableModule } from 'primeng/table';
// RxJS
import { forkJoin, from, of, Subscription, switchMap } from 'rxjs';

// Services and Utils
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
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

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
    PaginatorComponent,
    TableModule,
  ],
  templateUrl: './password-dashboard.component.html',
  styleUrls: ['./password-dashboard.component.css'],
})
export class PasswordDashboardComponent implements OnDestroy {
  searchTerm = '';
  selectedCategory = 'all';
  sortOption = 'created_desc';
  loading = true;
  cols: {
    field: keyof DecryptedPassword;
    header: keyof DecryptedPassword;
  }[] = [
    {
      field: 'website',
      header: 'website',
    },
    {
      field: 'userName',
      header: 'userName',
    },
    {
      field: 'email',
      header: 'email',
    },
    {
      field: 'password',
      header: 'password',
    },
    {
      field: 'category',
      header: 'category',
    },
    {
      field: 'notes',
      header: 'notes',
    },
  ];

  categoryOptions = categoryOptions;
  sortOptions = sortOptions;
  sortFn: PasswordSortFn<DecryptedPassword> = sortByDateDesc;

  passwords: IPassword[] = [];
  decryptedPasswords: (IDecryptedPassword & { toggle: boolean })[] = [];
  filteredPasswordList: (IDecryptedPassword & { toggle: boolean })[] = [];
  displayList = signal<(IDecryptedPassword & { toggle: boolean })[]>([]);

  // Subscriptions
  private passwordApiSub!: Subscription;
  private passwordListSub!: Subscription;

  // Services
  private passwordService = inject(PasswordService);
  private keyService = inject(KeyStorageService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  @ViewChild('tb') tableEl: Table | null = null;
  constructor() {
    this.loadPasswords();

    effect(() => {
      console.log('display list changed');
      console.log(this.displayList());
    });
  }

  setDisplayList(list: (IDecryptedPassword & { toggle: boolean })[]) {
    console.log('list = ', list);
    this.displayList.set(list);
  }

  private loadPasswords(): void {
    this.passwordApiSub = this.passwordService.getPasswordsApi().subscribe({
      next: ({ passwords }) => {
        this.passwordService.setPasswords(passwords);
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showError('Something went wrong', err.message);
        this.loading = false;
      },
    });

    this.subscribeToPasswordChanges();
  }

  private subscribeToPasswordChanges(): void {
    this.passwordListSub = this.passwordService.$password
      .pipe(
        switchMap((passwords) => {
          if (passwords.length === 0) {
            return of([]);
          }
          return forkJoin(passwords.map((p) => from(this.decryptPassword(p))));
        })
      )
      .subscribe({
        next: (decryptedPasswords) => {
          this.decryptedPasswords = decryptedPasswords;
          this.filteredPasswordList = [...decryptedPasswords];
          console.log(this.filteredPasswordList);
        },
        error: (err) => {
          this.toastService.showError('Decryption Error', err.message);
        },
      });
  }

  private async decryptPassword(
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

  copyField(text: string, type: 'email' | 'password'): void {
    navigator.clipboard.writeText(text);
    this.toastService.showSuccess(
      'Copied',
      `${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard`
    );
  }

  getDomainFromUrl(url: string): { hostname: string; pathname: string } {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const domain = new URL(url);
    return {
      hostname: domain.hostname,
      pathname: domain.hostname + '?token=pk_FceobK6OTIKRrKmZpV7KBQ',
    };
  }

  viewDetails(password: IDecryptedPassword): void {
    this.router.navigate(['/dashboard/passwords/', password._id]);
  }

  setFilteredData(list: (IDecryptedPassword & { toggle: boolean })[]) {
    console.log('changing filtered password data....');
    this.filteredPasswordList = list;
  }

  toast() {
    this.toastService.showSuccess(
      'Success',
      'Data successfully exported to CSV'
    );
  }

  onSortChange(option: string): void {
    switch (option) {
      case 'created_asc':
        this.sortFn = sortByDateAsc;
        break;
      case 'created_desc':
        this.sortFn = sortByDateDesc;
        break;
      case 'updated_asc':
        this.sortFn = sortByUpdatedAsc;
        break;
      case 'updated_desc':
        this.sortFn = sortByUpdatedDesc;
        break;
    }
  }

  exportToCsv() {
    if (this.tableEl) {
      this.tableEl.exportCSV();
      this.toastService.showSuccess('Success', 'Exported to csv');
    }
  }

  ngOnDestroy(): void {
    this.passwordApiSub?.unsubscribe();
    this.passwordListSub?.unsubscribe();
  }
}

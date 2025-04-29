import { CommonModule, NgClass } from '@angular/common';
import { Component, DoCheck, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownItem, DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordService } from '../../core/services/password/password-service.service';
import { categoryOptions } from '../../core/constants/category.options';
import { sortOptions } from '../../core/constants/sort.options';
import {
  IDecryptedPassword,
  IEncryptedField,
  IPassword,
} from '../../shared/interfaces/password.interface';
import { KeyStorageService } from '../../core/services/User/key-storage.service';
import { decryptWithBase64Key } from '../../utils/crypto.utils';
import { from, Subscription } from 'rxjs';
import { analyzePassword } from '../../utils/password.utils';
import { ToastService } from '../../core/services/toast/toast.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-password-dashboard',
  imports: [
    DropdownModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    InputText,
    InputGroupAddonModule,
    InputGroupModule,
    NgClass,
  ],
  templateUrl: './password-dashboard.component.html',
  styleUrl: './password-dashboard.component.css',
})
export class PasswordDashboardComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedCategory: string = 'all';
  sortOption: string = 'created';
  passwordService = inject(PasswordService);
  keyService = inject(KeyStorageService);
  categoryOptions = categoryOptions;
  sortOptions = sortOptions;
  passwords: IPassword[] = [];
  decryptedPasswords: (IDecryptedPassword & { toggle: boolean })[] = [];
  filteredPasswordList:
    | (IDecryptedPassword & { toggle: boolean })[]
    | undefined = [];
  showPassword = false;
  passwordApiSub!: Subscription;
  passwordListSub!: Subscription;
  toastService = inject(ToastService);
  router = inject(Router);
  constructor() {}

  ngOnInit(): void {
    this.passwordApiSub = this.passwordService.getPasswordsApi().subscribe({
      next: (value) => {
        console.log('VALUE ==== ', value);
        this.passwordService.passwordList = value.passwords;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.passwordListSub = this.passwordService.$password.subscribe({
      next: (value) => {
        // array of promises
        const decryptedPasswordList = value.map(async (password) => {
          const decryptedPassword = await decryptWithBase64Key(
            this.keyService.getDekKey() as string,
            password.password
          );

          const decryptedNotes = password.notes
            ? await decryptWithBase64Key(
                this.keyService.getDekKey() as string,
                password.notes
              )
            : '';

          return {
            ...password,
            password: decryptedPassword,
            notes: decryptedNotes,
            toggle: false,
          };
        });

        this.decryptedPasswords = [];
        from(Promise.all(decryptedPasswordList)).subscribe((val) => {
          this.decryptedPasswords = val;
        });
      },
    });
  }

  get filteredPasswords() {
    this.filteredPasswordList = [...this.decryptedPasswords];
    if (this.selectedCategory !== 'all') {
      this.filteredPasswordList = this.decryptedPasswords.filter(
        (item) => item.category === this.selectedCategory
      );
    }

    this.searchTerm = this.searchTerm.toLowerCase();
    if (this.searchTerm) {
      this.filteredPasswordList = this.filteredPasswordList.filter((item) => {
        return (
          item.website.toLowerCase().includes(this.searchTerm) ||
          item.email.toLowerCase().includes(this.searchTerm) ||
          item.userName.toLowerCase().includes(this.searchTerm)
        );
      });
    }

    if (this.sortOption === 'created') {
      this.filteredPasswordList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (this.sortOption === 'updated') {
      this.filteredPasswordList.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return this.filteredPasswordList;
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

  async viewPassword(password: IEncryptedField) {
    const base64Key = this.keyService.getDekKey();
    const decryptedPassword = await decryptWithBase64Key(
      base64Key as string,
      password
    );
    alert(`Password: ${decryptedPassword}`);
  }

  getDomainFromUrl(url: string): string {
    try {
      // Add https:// if no protocol is present
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      console.error('Invalid URL:', url);
      return '';
    }
  }

  viewDetails(password: IDecryptedPassword & { toggle: boolean }) {
    this.router.navigate(['/dashboard/passwords/', password._id]);
  }

  ngOnDestroy(): void {
    this.passwordApiSub.unsubscribe();
    this.passwordListSub.unsubscribe();
  }
}

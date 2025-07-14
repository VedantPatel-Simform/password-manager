import { sortOptions } from './../../core/constants/sort.options';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  IDecryptedPasswordShare,
  IPasswordShare,
} from '../../shared/interfaces/PasswordShare.interface';
import { PasswordSentService } from '../../core/services/password/password-sent.service';
import { SearchComponentComponent } from '../../shared/components/search-component/search-component.component';
import { ToastService } from '../../core/services/toast/toast.service';
import { KeyStorageService } from '../../core/services/User/key-storage.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import {
  decryptWithBase64Key,
  decryptWithPrivateKey,
} from '../../utils/crypto.utils';
import { catchError, from, of, switchMap } from 'rxjs';

import {
  DecryptedPassword,
  PasswordSortFn,
  sortByDateAsc,
  sortByDateDesc,
  sortByUpdatedAsc,
  sortByUpdatedDesc,
} from '../../utils/sortFn.utils';
import { Router } from '@angular/router';
import { PasswordReceivedService } from '../../core/services/password/password-received.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sent-by-me',
  imports: [SearchComponentComponent, TableModule, ButtonModule, NgClass],
  templateUrl: './recieved-by-me.component.html',
  styleUrl: './recieved-by-me.component.css',
})
export class ReceivedByMeComponent implements OnInit {
  receivedPasswordList: IDecryptedPasswordShare[] = [];
  receivedPasswordService = inject(PasswordReceivedService);
  $receivedPasswordsObs = this.receivedPasswordService.$receivedPasswordsObs;
  _filteredList: IDecryptedPasswordShare[] = [];
  loading = true;
  toastService = inject(ToastService);
  keyService = inject(KeyStorageService);

  searchTerm = '';
  selectedCategory = 'all';
  sortOption = 'created_desc';
  sortOptions = sortOptions;
  sortFn: PasswordSortFn<DecryptedPassword> = sortByDateDesc;
  @ViewChild('tb') tableEl: Table | null = null;
  router = inject(Router);

  categoryOptionList: { label: string; value: string }[] = [];

  getPasswords() {
    this.receivedPasswordService.getReceivedByMePasswords().subscribe({
      next: (res) => {
        console.log('response = ', res.passwords);
        this.receivedPasswordService.setPasswords(res.passwords);
      },
    });
  }

  handlePasswordObs() {
    this.$receivedPasswordsObs
      .pipe(
        switchMap((passwords) => {
          if (passwords.length === 0) {
            return of([]);
          }

          return from(
            Promise.all(passwords.map((p) => this.decryptPassword(p)))
          ).pipe(
            catchError((error) => {
              console.error('Decryption error:', error);
              return of([]);
            })
          );
        })
      )
      .subscribe({
        next: (decryptedPasswords) => {
          this.receivedPasswordList = decryptedPasswords;
          // Update category list
          const senderMailList = Array.from(
            new Set(decryptedPasswords.map((p) => p.senderMail))
          ).map((mail) => ({ label: mail, value: mail }));

          this.categoryOptionList = [
            { value: 'all', label: 'All' },
            ...senderMailList,
          ];
          console.log('cate list = ', this.categoryOptionList);
          this.loading = false;
        },
        error: (err) => {
          console.error('Final error:', err);
          this.loading = false;
        },
      });
  }
  ngOnInit(): void {
    this.getPasswords();
    this.handlePasswordObs();
  }

  async decryptPassword(
    password: IPasswordShare
  ): Promise<IDecryptedPasswordShare> {
    const privateKey = this.keyService.getPrivateKey()!;
    console.log(privateKey);
    const decryptedPEK = await decryptWithPrivateKey(
      privateKey,
      password.receiverPublicEncPEK
    );
    const decryptedPassword = await decryptWithBase64Key(
      decryptedPEK,
      password.password
    );

    const decryptedNotes = password.notes
      ? await decryptWithBase64Key(decryptedPEK, password.notes)
      : '';

    return {
      ...password,
      password: decryptedPassword,
      notes: decryptedNotes,
    };
  }

  get receivedPasswords() {
    console.log('received password list = ', this.receivedPasswordList);
    return this.receivedPasswordList;
  }

  get categoryOptions() {
    return this.categoryOptionList;
  }

  get filteredList() {
    return this._filteredList;
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

  setFilteredList(value: IDecryptedPasswordShare[]) {
    console.log('filtered lists = ', value);
    this._filteredList = value;
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

  copyField(field: string, type: 'email' | 'password') {
    if (type === 'email') {
      navigator.clipboard.writeText(field);
      this.toastService.showSuccess('Copied', 'Email Copied to clipboard');
      return;
    }
    if (type === 'password') {
      navigator.clipboard.writeText(field);
      this.toastService.showSuccess('Copied', 'Password Copied to clipboard');
      return;
    }
  }
  exportToCsv() {
    if (this.tableEl) {
      this.tableEl.exportCSV();
      this.toastService.showSuccess('Success', 'Exported to csv');
    }
  }
  getDaysRemaining(expireDate: string | Date): number {
    if (!expireDate) return 0; // Handle cases where expireDate might be null/undefined

    const expiry = new Date(expireDate);
    const today = new Date();

    // Reset time components to avoid time-of-day affecting the calculation
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  managePassword(id: string) {
    this.router.navigate(['dashboard/shared/manage', id], {
      state: {
        sender: false,
      },
    });
  }
}

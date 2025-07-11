import { sortOptions } from './../../core/constants/sort.options';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { from } from 'rxjs';

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

@Component({
  selector: 'app-sent-by-me',
  imports: [SearchComponentComponent, TableModule, ButtonModule],
  templateUrl: './recieved-by-me.component.html',
  styleUrl: './recieved-by-me.component.css',
})
export class ReceivedByMeComponent implements OnInit {
  receivedPasswordList = signal<IDecryptedPasswordShare[]>([]);
  receivedPasswordService = inject(PasswordReceivedService);
  $receivedPasswordsObs = this.receivedPasswordService.$receivedPasswordsObs;
  _filteredList = signal<IDecryptedPasswordShare[]>([]);
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

  categoryOptionList = signal<{ label: string; value: string }[]>([]);
  ngOnInit(): void {
    this.receivedPasswordService.getReceivedByMePasswords().subscribe({
      next: (res) => {
        console.log(res);
        this.receivedPasswordService.setPasswords(res.passwords);
      },
    });
    this.$receivedPasswordsObs.subscribe({
      next: (res) => {
        this.loading = true;
        const decryptSharedPasswords = res.map(
          async (p) => await this.decryptPassword(p)
        );
        from(Promise.all(decryptSharedPasswords)).subscribe((value) => {
          console.log('value = ', value);
          this.receivedPasswordList.set(value);
          let senderMailList = Array.from(
            new Set(this.sharedPasswords.map((p) => p.senderMail))
          ).map((receiverMail) => ({
            label: receiverMail,
            value: receiverMail,
          }));

          this.categoryOptionList.set([
            { value: 'all', label: 'All' },
            ...senderMailList,
          ]);
          console.log(this.categoryOptionList());

          this.loading = false;
        });
      },
      error: (err) => {
        this.toastService.showError('Error', JSON.stringify(err));
      },
    });
  }

  async decryptPassword(
    password: IPasswordShare
  ): Promise<IDecryptedPasswordShare> {
    const privateKey = this.keyService.getPrivateKey()!;
    const decryptedPEK = await decryptWithPrivateKey(
      privateKey,
      password.senderPublicEncPEK
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

  get sharedPasswords() {
    return this.receivedPasswordList();
  }

  get categoryOptions() {
    return this.categoryOptionList();
  }

  get filteredList() {
    return this._filteredList();
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
    this._filteredList.set(value);
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

  managePassword(id: string) {
    this.router.navigate(['dashboard/shared/manage', id]);
  }
}

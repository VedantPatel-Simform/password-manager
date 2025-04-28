import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  IEncryptedField,
  IPassword,
} from '../../shared/interfaces/password.interface';
import { KeyStorageService } from '../../core/services/User/key-storage.service';
import { decryptWithBase64Key } from '../../utils/crypto.utils';
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
  ],
  templateUrl: './password-dashboard.component.html',
  styleUrl: './password-dashboard.component.css',
})
export class PasswordDashboardComponent {
  searchTerm: string = '';
  selectedCategory: string = 'all';
  sortOption: string = 'created';
  passwordService = inject(PasswordService);
  keyService = inject(KeyStorageService);
  categoryOptions = categoryOptions;
  sortOptions = sortOptions;
  passwords: IPassword[] = [];
  constructor() {}

  ngOnInit(): void {
    this.passwordService.getPasswordsApi().subscribe({
      next: (value) => {
        this.passwordService.passwordList = value.passwords;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.passwordService.$password.subscribe({
      next: (value) => {
        this.passwords = value;
      },
    });
  }

  get filteredPasswords() {
    return this.passwords;
  }

  async copyPassword(password: IEncryptedField) {
    const base64Key = this.keyService.getDekKey();
    const decryptedPassword = await decryptWithBase64Key(
      base64Key as string,
      password
    );
    navigator.clipboard.writeText(decryptedPassword);
    alert('Password copied to clipboard!');
  }

  async viewPassword(password: IEncryptedField) {
    const base64Key = this.keyService.getDekKey();
    const decryptedPassword = await decryptWithBase64Key(
      base64Key as string,
      password
    );
    alert(`Password: ${decryptedPassword}`);
  }
}

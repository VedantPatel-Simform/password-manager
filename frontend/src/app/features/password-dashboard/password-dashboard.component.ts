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
import { IPassword } from '../../shared/interfaces/password.interface';
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

  copyPassword(password: string) {
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
  }

  viewPassword(password: string) {
    alert(`Password: ${password}`);
  }
}

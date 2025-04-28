import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownItem, DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
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

  // Category Options
  categoryOptions = [
    { label: 'All', value: 'all' },
    { label: 'Social Media', value: 'social_media' },
    { label: 'Work & Professional', value: 'work_professional' },
    { label: 'Banking & Finance', value: 'banking_finance' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Personal', value: 'personal' },
    { label: 'Education & Learning', value: 'education' },
    { label: 'Shopping & E-commerce', value: 'shopping_ecommerce' },
    { label: 'Health & Fitness', value: 'health_fitness' },
    { label: 'Travel & Tourism', value: 'travel_tourism' },
    { label: 'Other', value: 'other' },
  ];

  // Sort Options
  sortOptions = [
    { label: 'Date Created', value: 'created' },
    { label: 'Date Updated', value: 'updated' },
  ];

  // Sample Passwords
  passwords = [
    {
      id: 1,
      website: 'Facebook',
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      category: 'social_media',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-03-01'),
    },
    {
      id: 2,
      website: 'LinkedIn',
      username: 'jane_doe',
      email: 'jane@example.com',
      password: 'securepass456',
      category: 'work_professional',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-04-05'),
    },
    {
      id: 3,
      website: 'Bank of America',
      username: 'bsmith',
      email: 'bsmith@bankmail.com',
      password: 'bankpass789',
      category: 'banking_finance',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20'),
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  get filteredPasswords() {
    if (this.selectedCategory !== 'all') {
      let filtered = [...this.passwords];
      // Search
      if (this.searchTerm) {
        filtered = filtered.filter((p) =>
          (p.website + p.username + p.email)
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      }

      // Category Filter
      if (this.selectedCategory) {
        filtered = filtered.filter((p) => p.category === this.selectedCategory);
      }

      // Sort
      if (this.sortOption === 'created') {
        filtered = filtered.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      } else {
        filtered = filtered.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
      }
      return filtered;
    }

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

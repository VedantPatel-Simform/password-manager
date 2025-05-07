import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';

// Angular Modules
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import Fuse from 'fuse.js';
import { IDecryptedPassword } from '../../interfaces/password.interface';
import { PasswordSortFn, DecryptedPassword } from '../../../utils/sortFn.utils';
import { DeletedPassword } from '../../../features/recycle-bin/recycle-bin.component';

type InputData =
  | (IDecryptedPassword & { toggle: boolean })[]
  | (IDecryptedPassword & { daysLeft: number })[];

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputText,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css'],
})
export class SearchComponentComponent implements DoCheck {
  searchTerm: string = '';
  selectedCategory: string = 'all';

  @Input() categoryOptions: { value: string; label: string }[] = [];
  @Input() sortOptions: { value: string; label: string }[] = [];
  @Input() sortOption: string = '';
  @Input() data: InputData = [];
  @Input() sortFun!:
    | PasswordSortFn<DeletedPassword>
    | PasswordSortFn<DecryptedPassword>;

  @Output() result = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<any>();

  ngDoCheck(): void {
    this.filteredPasswords();
  }

  private filteredPasswords(): void {
    let filtered = [...this.data];

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(
        (item) => item.category === this.selectedCategory
      );
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();

      const fuse = new Fuse(filtered, {
        keys: ['website'],
        threshold: 0.3,
      });

      const fuzzyResults = fuse.search(term).map((r) => r.item);
      const exactResults = filtered.filter(
        (item) =>
          item.userName.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term)
      );

      const combinedResults = [...fuzzyResults, ...exactResults];
      const seen = new Set();

      filtered = combinedResults.filter((item) => {
        const key = item._id || item.email || JSON.stringify(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    const isDeletedPassword = (item: any): item is DeletedPassword =>
      'daysLeft' in item;
    const isDecryptedPassword = (item: any): item is DecryptedPassword =>
      'toggle' in item;

    // Narrowing type of the array to DeletedPassword or DecryptedPassword
    if (filtered.every(isDeletedPassword)) {
      filtered.sort(this.sortFun as PasswordSortFn<DeletedPassword>);
    } else if (filtered.every(isDecryptedPassword)) {
      filtered.sort(this.sortFun as PasswordSortFn<DecryptedPassword>);
    }

    this.result.emit(filtered);
    this.sortChange.emit(this.sortOption);
  }
}

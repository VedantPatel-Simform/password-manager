import { IDecryptedPassword } from './../../interfaces/password.interface';
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
import { PasswordSortFn, DecryptedPassword } from '../../../utils/sortFn.utils';
import { DeletedPassword } from '../../../features/recycle-bin/recycle-bin.component';
import { IDecryptedPasswordShare } from '../../interfaces/PasswordShare.interface';

type InputData =
  | (IDecryptedPassword & { toggle: boolean })[]
  | (IDecryptedPassword & { daysLeft: number })[]
  | IDecryptedPasswordShare[];
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
  selectedFilteredValue: string = 'all';

  @Input() categoryOptions: { value: string; label: string }[] = [];
  @Input() sortOptions: { value: string; label: string }[] = [];
  @Input() sortOption: string = '';
  @Input() data: InputData = [];
  @Input() filterKey: 'category' | 'receiverMail' | 'senderMail' = 'category';
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
    console.log('cate opns in ', this.categoryOptions);
    // Filter by selected value
    if (this.selectedFilteredValue !== 'all') {
      filtered = filtered.filter((item) => {
        const value = (item as any)[this.filterKey];
        return value === this.selectedFilteredValue;
      });
    }

    // Filter by search term (simple exact matching)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.website.toLowerCase().includes(term) ||
          item.userName.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term)
      );
    }

    // Type checking and sorting
    const isDeletedPassword = (item: any): item is DeletedPassword =>
      'daysLeft' in item;
    const isDecryptedPassword = (item: any): item is DecryptedPassword =>
      'toggle' in item || 'receiverMail' in item;

    if (filtered.every(isDeletedPassword)) {
      filtered.sort(this.sortFun as PasswordSortFn<DeletedPassword>);
    } else if (filtered.every(isDecryptedPassword)) {
      filtered.sort(this.sortFun as PasswordSortFn<DecryptedPassword>);
    }

    // Emit results
    this.result.emit(filtered);
    this.sortChange.emit(this.sortOption);
  }
}

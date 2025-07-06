import { IDecryptedPassword } from './../../interfaces/password.interface';
import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

// Angular Modules
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs';

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
    ReactiveFormsModule,
  ],
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.css'],
})
export class SearchComponentComponent implements OnChanges {
  searchTerm = new FormControl('');
  selectedFilteredValue: string = 'all';

  @Input() categoryOptions: { value: string; label: string }[] = [];
  @Input() sortOptions: { value: string; label: string }[] = [];
  @Input() sortOption: string = '';
  @Input() data: InputData = [];
  @Input() filterKey: 'category' | 'receiverMail' = 'category';
  @Input() sortFun!:
    | PasswordSortFn<DeletedPassword>
    | PasswordSortFn<DecryptedPassword>;

  @Output() result = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<any>();

  constructor() {
    this.searchTerm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          console.log('value = ', value, ' emitted');
          this.filteredPasswords(value);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredPasswords(this.searchTerm.value!);
  }

  private filteredPasswords(searchTerm: string): void {
    let filtered = [...this.data];

    // Filter by selected value
    if (this.selectedFilteredValue !== 'all') {
      filtered = filtered.filter((item) => {
        const value = (item as any)[this.filterKey];
        return value === this.selectedFilteredValue;
      });
    }

    // Filter by search term (simple exact matching)
    if (searchTerm.length !== 0) {
      const term = searchTerm.toLowerCase();
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

    this.result.emit(filtered);
    this.sortChange.emit(this.sortOption);
  }
}

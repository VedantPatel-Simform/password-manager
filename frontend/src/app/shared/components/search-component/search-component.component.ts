import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
// PrimeNG Modules
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DropdownModule, Dropdown, DropdownItem } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import Fuse from 'fuse.js';
@Component({
  selector: 'app-search-component',
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
  styleUrl: './search-component.component.css',
})
export class SearchComponentComponent implements DoCheck {
  searchTerm: string = '';
  selectedCategory: string = 'all';
  @Input('categoryOptions') categoryOptions: {
    value: string;
    label: string;
  }[] = [];
  @Input('sortOptions') sortOptions: {
    value: string;
    label: string;
  }[] = [];
  @Input('sortOption') sortOption: string = '';
  @Input('data') data: any[] = [];
  @Output('result') result = new EventEmitter<any[]>();
  @Output('sortChange') sortChange = new EventEmitter<any>();
  @Input('sortFun') sortFun: any;
  filteredPasswords(): any {
    let filtered = [...this.data];

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    // Fuzzy search
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
        const key = item.id || item.email || JSON.stringify(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    filtered.sort(this.sortFun);

    this.result.emit(filtered);
    this.sortChange.emit(this.sortOption);
  }

  ngDoCheck(): void {
    this.filteredPasswords();
  }
}

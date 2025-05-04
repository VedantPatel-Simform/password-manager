import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
// PrimeNG Modules
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DropdownModule, Dropdown, DropdownItem } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
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
  @Input('categoryOptions') categoryOptions: any;
  @Input('sortOptions') sortOptions: any;
  @Input('sortOption') sortOption: any;
  @Input('data') data: any[] = [];
  @Output('result') result = new EventEmitter<any[]>();
  @Output('sortChange') sortChange = new EventEmitter<any>();
  @Input('sortFun') sortFun: any;
  filteredPasswords(): any {
    let filtered = [...this.data];

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.website.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.userName.toLowerCase().includes(term)
      );
    }

    filtered.sort(this.sortFun);

    console.log(filtered);
    this.result.emit(filtered);
    this.sortChange.emit(this.sortOption);
  }

  ngDoCheck(): void {
    this.filteredPasswords();
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
  OnChanges,
  Signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
})
export class PaginatorComponent implements OnChanges {
  @Input({ required: true }) data!: WritableSignal<any[]>;
  @Input({ required: true }) pageSize!: number;
  @Input() maxVisiblePages = 10; // Number of page buttons to show
  @Input({ required: true }) dataToDisplay!: WritableSignal<any[]>;
  // @Output()
  // pageChange = new EventEmitter<any[]>();

  currentPage = signal(1);
  totalPages = computed(() => Math.ceil(this.data().length / this.pageSize));

  // Calculate the visible page range
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = this.maxVisiblePages;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    // Adjust if we're at the end
    if (end === total) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  paginatedData = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.data().length);
    return this.data().slice(startIndex, endIndex);
  });

  ngOnChanges() {
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
    this.emitPageData();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.emitPageData();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }

  private emitPageData() {
    console.log('changing data');
    console.log('filtered data = ', this.data());
    this.dataToDisplay.set(this.paginatedData());
    // this.pageChange.emit(this.paginatedData());
  }
}

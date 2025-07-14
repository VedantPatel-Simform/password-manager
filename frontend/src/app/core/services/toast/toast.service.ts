import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  // Success toast
  showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
    });
  }

  // Error toast
  showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
    });
  }

  // Info toast
  showInfo(summary: string, detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
    });
  }

  // Warn toast
  showWarn(summary: string, detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: detail,
    });
  }

  // Clear all toasts
  clear() {
    this.messageService.clear();
  }
}

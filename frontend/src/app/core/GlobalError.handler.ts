// src/app/core/error-handler.service.ts
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './services/toast/toast.service';
import { AppErrorHandler } from '../shared/classes/AppError.handler';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private router = inject(Router);
  private toast = inject(ToastService);
  handleError(error: unknown): void {
    if (error instanceof AppErrorHandler) {
      console.log(error);
      this.toast.showError(error.type, error.message);
    } else if (error instanceof HttpErrorResponse) {
      this.toast.showError('Http Error', error.message);
    }
  }
}

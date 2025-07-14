import { Component, OnInit, inject } from '@angular/core';
import {
  FileSelectEvent,
  FileUpload,
  FileUploadEvent,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { UploadCsvService } from './upload-csv.service';
import { ToastService } from '../../core/services/toast/toast.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileSizePipe } from './filesize.pipe';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { Dialog } from 'primeng/dialog';

interface ValidationError {
  row: number;
  message: string;
  details?: string;
}

@Component({
  selector: 'app-upload-csv',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    CommonModule,
    FileSizePipe,
    AccordionModule,
    Dialog,
  ],
  templateUrl: './upload-csv.component.html',
  styleUrl: './upload-csv.component.css',
})
export class UploadCsvComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  validationErrors: ValidationError[] = [];
  uploadService = inject(UploadCsvService);
  router = inject(Router);
  toast = inject(ToastService);
  displayValidationErrors = false;
  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      csvFile: [null, Validators.required],
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({
        csvFile: this.selectedFile,
      });
      this.validationErrors = []; // Clear previous errors when new file is selected
    }
  }

  async onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      try {
        this.validationErrors = []; // Reset errors before processing
        await this.uploadService.processFile(this.selectedFile);
      } catch (err: any) {
        if (err.errors) {
          // Handle structured validation errors
          this.validationErrors = err.errors.map((error: any) => ({
            row: error.row || 0,
            message: error.message || 'Validation error',
            details: error.details,
          }));
          this.displayValidationErrors = true;
        } else {
          // Handle other errors
          this.toast.showError('Error', err.message);
        }
      }
    }
  }
  showValidationErrors() {
    this.displayValidationErrors = true;
  }
  getUniqueRowCount(): number {
    if (!this.validationErrors?.length) return 0;
    const uniqueRows = new Set(this.validationErrors.map((e) => e.row));
    return uniqueRows.size;
  }

  downloadSampleCSV() {
    const sampleContent =
      'website,userName,email,password,category,notes\n' +
      'facebook.com,john_doe,john@example.com,J0hnP@ss123,social_media,"Personal account"\n' +
      'linkedin.com,jane_smith,jane@example.com,J@neSecure456,work_professional,"Work profile"';

    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

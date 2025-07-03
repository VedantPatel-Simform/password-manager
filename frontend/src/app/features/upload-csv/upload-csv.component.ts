import { Component, inject } from '@angular/core';
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
@Component({
  selector: 'app-upload-csv',
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, FileSizePipe],
  templateUrl: './upload-csv.component.html',
  styleUrl: './upload-csv.component.css',
})
export class UploadCsvComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadService = inject(UploadCsvService);

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
    }
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      this.uploadService.processFile(this.selectedFile);
    } else {
      alert('error');
    }
  }

  downloadSampleCSV() {
    const sampleContent =
      'name,username,password,url\nExample,user1,pass123,https://example.com';
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

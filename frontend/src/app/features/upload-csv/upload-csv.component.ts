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

@Component({
  selector: 'app-upload-csv',
  imports: [ButtonModule, ReactiveFormsModule, CommonModule, FileSizePipe],
  templateUrl: './upload-csv.component.html',
  styleUrl: './upload-csv.component.css',
})
export class UploadCsvComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadService = inject(UploadCsvService);
  router = inject(Router);
  toast = inject(ToastService);
  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      csvFile: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (
      this.uploadService.success().success == true &&
      typeof this.uploadService.success().message === 'string'
    ) {
      this.toast.showSuccess(
        'Passwords successfully added',
        this.uploadService.success().message!
      );
      this.uploadService.success.set({});
      this.router.navigate(['dashboard']);
    }
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

import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { Checkbox } from 'primeng/checkbox';
import { ToastService } from '../../../core/services/toast/toast.service';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';

import {
  analyzePassword,
  PasswordAnalysis,
  generatePassword,
  generatePassphrase,
} from '../../../utils/password.utils';
@Component({
  selector: 'app-create-password',
  standalone: true,
  imports: [
    FormsModule,
    SliderModule,
    Checkbox,
    NgClass,
    TitleCasePipe,
    NgIf,
    NgFor,
    Tooltip,
  ],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.css',
})
export class CreatePasswordComponent implements OnInit {
  passwordLength = 12;
  includeUppercase = true;
  includeLowercase = true;
  includeNumbers = true;
  includeSymbols = true;
  generatedPassword = '';
  passwordAnalytics!: PasswordAnalysis;
  timer: any;

  toastService = inject(ToastService);

  ngOnInit(): void {
    this.generatePassword();
  }

  copyPassword(): void {
    navigator.clipboard
      .writeText(this.generatedPassword)
      .then(() => {
        this.toastService.clear();
        this.toastService.showSuccess('Copied', 'Password copied to clipboard');
      })
      .catch(() => {
        this.toastService.clear();
        this.toastService.showError('Error', 'Failed to copy password');
      });

    // Auto-clear after 2 minutes
    this.timer = setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 2 * 60 * 1000);
  }

  generatePassword(): void {
    this.generatedPassword = generatePassword(
      this.passwordLength,
      this.includeUppercase,
      this.includeNumbers,
      this.includeSymbols
    );
    this.passwordAnalytics = analyzePassword(this.generatedPassword);
    console.log(generatePassphrase(this.passwordLength, '-'));
  }
}

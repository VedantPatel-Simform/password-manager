import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { Checkbox } from 'primeng/checkbox';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../core/services/toast/toast.service';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import {
  analyzePassword,
  PasswordAnalysis,
} from '../../utils/password.analytics';
@Component({
  selector: 'app-generate-password',
  standalone: true,
  imports: [
    FormsModule,
    SliderModule,
    Checkbox,
    ToastComponent,
    NgClass,
    TitleCasePipe,
    NgIf,
    NgFor,
    Tooltip,
  ],
  templateUrl: './generate-password.component.html',
  styleUrl: './generate-password.component.css',
})
export class GeneratePasswordComponent implements OnInit, OnDestroy {
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

  ngOnDestroy(): void {
    clearTimeout(this.timer);
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
    const charset = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      number: '0123456789',
      symbol: '!@#$%^&*()_+[]{}|;:,.<>?',
    };

    let pool = this.includeLowercase ? charset.lower : '';
    if (this.includeUppercase) pool += charset.upper;
    if (this.includeNumbers) pool += charset.number;
    if (this.includeSymbols) pool += charset.symbol;

    let password = '';
    for (let i = 0; i < this.passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      password += pool[randomIndex];
    }

    this.generatedPassword = password;
    this.passwordAnalytics = analyzePassword(
      password,
      this.includeUppercase,
      this.includeLowercase,
      this.includeNumbers
    );
    // passwordAnalytics = {strength : weak | strong | medium | very-strong, crackTime: string }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { Checkbox } from 'primeng/checkbox';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

import { ToastService } from '../../../../core/services/toast/toast.service';
import { generatePassword } from '../../../../utils/password.utils';
@Component({
  selector: 'app-modal-password',
  imports: [
    FormsModule,
    SliderModule,
    Checkbox,
    ButtonModule,
    NgClass,
    TitleCasePipe,
    Tooltip,
  ],
  templateUrl: './modal-password.component.html',
  styleUrl: './modal-password.component.css',
})
export class ModalPasswordComponent {
  passwordLength = 12;
  includeLowercase = true;
  includeUppercase = true;
  includeNumbers = true;
  includeSymbols = true;
  generatedPassword = '';
  timer: any;

  getPassword() {
    return this.generatedPassword;
  }

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
  }
}

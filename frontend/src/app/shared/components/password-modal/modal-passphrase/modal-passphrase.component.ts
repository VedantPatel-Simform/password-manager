// create-passphrase-modal.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { TooltipModule } from 'primeng/tooltip';

import {
  analyzePassword,
  generatePassphrase,
  PasswordAnalysis,
} from '../../../../utils/password.utils';

@Component({
  selector: 'app-modal-passphrase',
  standalone: true,
  templateUrl: './modal-passphrase.component.html',
  styleUrls: [],
  imports: [FormsModule, SliderModule, ButtonModule, TooltipModule],
})
export class ModalPassphraseComponent implements OnInit {
  wordCount = 4;
  numberCount = 2;
  separator = '-';
  generatedPassphrase = '';
  passphraseAnalytics!: PasswordAnalysis;
  timer: any;

  getPassphrase() {
    return this.generatedPassphrase;
  }

  toastService = inject(ToastService);

  ngOnInit(): void {
    this.generatePassphrase();
  }

  setNumberCount(value: number): void {
    if (value >= 0 && value <= 10) {
      this.numberCount = value;
    } else {
      this.numberCount = 0;
      this.toastService.showWarn(
        'Warning',
        'Number count must be between 0 and 10'
      );
    }
    this.generatePassphrase();
  }

  generatePassphrase(): void {
    this.generatedPassphrase = generatePassphrase(
      this.wordCount,
      this.separator,
      this.numberCount
    );
    this.passphraseAnalytics = analyzePassword(this.generatedPassphrase);
  }

  copyPassphrase(): void {
    navigator.clipboard
      .writeText(this.generatedPassphrase)
      .then(() => {
        this.toastService.clear();
        this.toastService.showSuccess(
          'Copied',
          'Passphrase copied to clipboard'
        );
      })
      .catch(() => {
        this.toastService.clear();
        this.toastService.showError('Error', 'Failed to copy passphrase');
      });

    this.timer = setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 2 * 60 * 1000);
  }
}

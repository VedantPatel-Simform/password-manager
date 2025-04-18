import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { Tooltip } from 'primeng/tooltip';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ToastService } from '../../../core/services/toast/toast.service';

import {
  analyzePassword,
  PasswordAnalysis,
  generatePassphrase,
} from '../../../utils/password.utils';

@Component({
  selector: 'app-create-pass-phrase',
  standalone: true,
  imports: [
    FormsModule,
    SliderModule,
    NgClass,
    NgIf,
    TitleCasePipe,
    Tooltip,
    NgFor,
  ],
  templateUrl: './create-pass-phrase.component.html',
  styleUrl: './create-pass-phrase.component.css',
})
export class CreatePassPhraseComponent implements OnInit {
  wordCount = 4;
  numberCount = 2;
  generatedPassphrase = '';
  separator = '-';
  passphraseAnalytics!: PasswordAnalysis;
  timer: any;

  toastService = inject(ToastService);

  ngOnInit(): void {
    this.generatePassphrase();
  }

  setNumberCount(value: string): void {
    const numValue = Number(value);
    this.numberCount =
      numValue >= 0 && numValue <= 10 ? numValue : this.numberCount;
    this.generatePassphrase();
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

  generatePassphrase(): void {
    this.generatedPassphrase = generatePassphrase(
      this.wordCount,
      this.separator,
      this.numberCount
    );
    this.passphraseAnalytics = analyzePassword(this.generatedPassphrase);
  }
}

import { Component } from '@angular/core';
import { CreatePasswordComponent } from '../../shared/components/create-password/create-password.component';
import { CreatePassPhraseComponent } from '../../shared/components/create-pass-phrase/create-pass-phrase.component';
import { NgClass, NgIf } from '@angular/common';
@Component({
  selector: 'app-generate-password',
  standalone: true,
  imports: [CreatePasswordComponent, CreatePassPhraseComponent, NgClass, NgIf],
  templateUrl: './generate-password.component.html',
  styleUrl: './generate-password.component.css',
})
export class GeneratePasswordComponent {
  selectedTab: 'password' | 'passphrase' = 'password';
}

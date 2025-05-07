import { Component, ViewChild } from '@angular/core';
import { ModalPassphraseComponent } from './modal-passphrase/modal-passphrase.component';
import { ModalPasswordComponent } from './modal-password/modal-password.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-password-modal',
  imports: [ModalPassphraseComponent, ModalPasswordComponent, NgClass],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.css',
})
export class PasswordModalComponent {
  selectedTab: 'password' | 'passphrase' = 'password';
  @ViewChild('passwordModal') passwordModal!: ModalPasswordComponent;
  @ViewChild('passphraseModal') passphraseModal!: ModalPassphraseComponent;

  getPassword() {
    if (this.selectedTab === 'passphrase') {
      return this.passphraseModal.getPassphrase();
    }
    return this.passwordModal.getPassword();
  }
}

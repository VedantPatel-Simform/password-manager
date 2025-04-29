import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../../core/services/password/password-service.service';
import {
  IDecryptedPassword,
  IPassword,
} from '../../interfaces/password.interface';
import { KeyStorageService } from '../../../core/services/User/key-storage.service';
import { decryptWithBase64Key } from '../../../utils/crypto.utils';

@Component({
  selector: 'app-view-password',
  imports: [],
  templateUrl: './view-password.component.html',
  styleUrl: './view-password.component.css',
})
export class ViewPasswordComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  passwordService = inject(PasswordService);
  keyService = inject(KeyStorageService);

  dek = this.keyService.getDekKey() as string;

  localPassword!: IPassword;
  localDecryptedPassword!: IDecryptedPassword;
  passwordId!: string;
  ngOnInit() {
    this.passwordId = this.activatedRouter.snapshot.params['id'];
    this.passwordService
      .getPasswordApi(this.passwordId)
      .subscribe(async (res) => {
        this.localPassword = res.password;
        const decryptedPassword = await decryptWithBase64Key(
          this.dek,
          this.localPassword.password
        );

        const decryptedNotes = this.localPassword.notes
          ? await decryptWithBase64Key(this.dek, this.localPassword.notes)
          : '';
        this.localDecryptedPassword = {
          ...this.localPassword,
          password: decryptedPassword,
          notes: decryptedNotes,
        };

        console.log(this.localDecryptedPassword);
      });
  }
}

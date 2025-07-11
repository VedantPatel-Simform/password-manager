import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, switchMap } from 'rxjs';
import {
  IEditSharedPassword,
  IEditSharedPasswordBody,
  IPasswordShare,
  SharedPasswordBody,
  SharedPasswordSendBody,
} from '../../../shared/interfaces/PasswordShare.interface';
import { HttpClient } from '@angular/common/http';
import {
  encryptWithBase64Key,
  encryptWithPublicKey,
  generateRandomBase64AesKey,
} from '../../../utils/crypto.utils';
import { KeyStorageService } from '../User/key-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PasswordReceivedService {
  private passwords = new BehaviorSubject<IPasswordShare[]>([]);
  $receivedPasswordsObs = this.passwords.asObservable();

  keyService = inject(KeyStorageService);

  http = inject(HttpClient);
  setPasswords(data: IPasswordShare[]) {
    this.passwords.next(data);
  }

  verifyMail(receiverMail: string) {
    return this.http.get<{
      receiver: {
        publicKey: string;
      };
      success: boolean;
    }>('/user/received/verifymail/' + receiverMail);
  }

  getReceivedByMePasswords() {
    return this.http.get<{ success: boolean; passwords: IPasswordShare[] }>(
      '/user/received/'
    );
  }

  getPasswordDetails(passwordId: string) {
    return this.http.get<{ success: boolean; password: IPasswordShare }>(
      `/user/received/${passwordId}`
    );
  }

  editPasswordApi(
    data: IEditSharedPasswordBody,
    passwordPEK: string,
    senderPubPEK: string
  ) {
    return this.verifyMail(data.receiverMail).pipe(
      switchMap(async (res) => {
        if (res.success) {
          const receiverPublickKey = res.receiver.publicKey;
          const encPassword = await encryptWithBase64Key(
            passwordPEK,
            data.password
          );
          const encNotes = data.notes
            ? await encryptWithBase64Key(passwordPEK, data.notes)
            : undefined;
          const receiverPublicEncPEK = await encryptWithPublicKey(
            res.receiver.publicKey,
            passwordPEK
          );
          const passwordSendBody: IEditSharedPassword = {
            ...data,
            password: encPassword,
            notes: encNotes,
            receiverPublicEncPEK: receiverPublicEncPEK,
            senderPublicEncPEK: senderPubPEK,
          };

          return this.http.put<{
            success: boolean;
            body: IEditSharedPassword;
          }>('/user/shared', passwordSendBody);
        } else {
          throw new Error('Email verification failed');
        }
      })
    );
  }
  constructor() {}
}

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, switchMap } from 'rxjs';
import {
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
export class PasswordSentService {
  private passwords = new BehaviorSubject<IPasswordShare[]>([]);
  $sentPasswordsObs = this.passwords.asObservable();

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
    }>('/user/shared/verifymail/' + receiverMail);
  }

  sendPassword(formData: SharedPasswordBody) {
    return this.verifyMail(formData.receiverMail).pipe(
      switchMap(async (response) => {
        if (response.success && response.receiver?.publicKey) {
          const randomPEK = await generateRandomBase64AesKey();
          const receiverPublicEncPEK = await encryptWithPublicKey(
            response.receiver.publicKey,
            randomPEK
          );
          const senderPublicEncPEK = await encryptWithPublicKey(
            this.keyService.getPublicKey()!,
            randomPEK
          );

          const encryptedPassword = await encryptWithBase64Key(
            randomPEK,
            formData.password
          );

          const encryptedNotes = formData.notes
            ? await encryptWithBase64Key(randomPEK, formData.notes)
            : undefined;

          const sendData: SharedPasswordSendBody = {
            receiverPublicEncPEK,
            receiverMail: formData.receiverMail,
            senderPublicEncPEK,
            password: encryptedPassword,
            notes: encryptedNotes,
            category: formData.category.value,
            website: formData.website,
            email: formData.email,
            userName: formData.userName,
            expireDate: formData.expireDate,
          };

          console.log('send data = ', sendData);
          return this.http.post<{ success: boolean; message: string }>(
            '/user/shared/',
            sendData
          );
        } else {
          throw new Error('Receiver email verification failed');
        }
      }),
      mergeMap((data) => data)
    );
  }

  getSentByMePasswords() {
    return this.http.get<{ success: boolean; passwords: IPasswordShare[] }>(
      '/user/shared/'
    );
  }

  getPasswordDetails(passwordId: string) {
    return this.http.get<{ success: boolean; password: IPasswordShare }>(
      `/user/shared/${passwordId}`
    );
  }

  deletePasswordApi(passwordId: string) {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`/user/shared/${passwordId}`);
  }

  editPasswordApi(data: SharedPasswordSendBody & { _id: string }) {}
  constructor() {}
}

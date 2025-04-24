import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  IPassword,
  IEncryptedField,
} from '../../../shared/interfaces/password.interface';
import { BehaviorSubject, from, switchMap } from 'rxjs';
import { encryptWithBase64Key } from '../../../utils/crypto.utils';
import { KeyStorageService } from '../User/key-storage.service';

type PasswordBody = {
  website: string;
  userName: string;
  email: string;
  password: string;
  notes?: string;
};

type PasswordType = Omit<
  IPassword,
  'userId' | 'deleted' | 'deletedTimeStamp' | 'autoDeleteDate'
>;

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  http = inject(HttpClient);
  keyService = inject(KeyStorageService);
  constructor() {}

  private $passwordList = new BehaviorSubject<IPassword[]>([]);
  $password = this.$passwordList.asObservable();

  get $passwords() {
    return this.$password;
  }

  getPasswordsApi() {
    return this.http.get<{ success: boolean; password: IPassword[] }>('/all/');
  }

  deletePasswordApi(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(
      '/user/password/delete/' + id
    );
  }

  restorePasswordApi(id: string) {
    return this.http.patch<{ success: boolean; message: string }>(
      '/user/password/restore/' + id,
      {}
    );
  }

  createPasswordApi(password: PasswordBody) {
    const encryptionKey = this.keyService.getEncryptionKey() as string;

    return from(
      Promise.all([
        encryptWithBase64Key(encryptionKey, password.password),
        password.notes
          ? encryptWithBase64Key(encryptionKey, password.notes)
          : Promise.resolve(undefined),
      ])
    ).pipe(
      switchMap(([encryptedPassword, encryptedNotes]) => {
        const sendPassword: PasswordType = {
          email: password.email,
          website: password.website,
          userName: password.userName,
          password: encryptedPassword,
          notes: encryptedNotes,
        };
        console.log('send password = ', sendPassword);
        return this.http.post<{ success: boolean; password: IPassword }>(
          '/user/password/add/',
          sendPassword
        );
      })
    );
  }

  editPasswordApi(password: PasswordBody) {
    const encryptionKey = this.keyService.getEncryptionKey() as string;

    return from(
      Promise.all([
        encryptWithBase64Key(encryptionKey, password.password),
        password.notes
          ? encryptWithBase64Key(encryptionKey, password.notes)
          : Promise.resolve(undefined),
      ])
    ).pipe(
      switchMap(([encryptedPassword, encryptedNotes]) => {
        const sendPassword: PasswordType = {
          email: password.email,
          website: password.website,
          userName: password.userName,
          password: encryptedPassword,
          notes: encryptedNotes,
        };

        return this.http.put<{ success: boolean; message: string }>(
          '/user/password/edit',
          sendPassword
        );
      })
    );
  }
}

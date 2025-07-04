import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  IPassword,
  IEncryptedField,
  CategoryValue,
} from '../../../shared/interfaces/password.interface';
import { BehaviorSubject, from, switchMap } from 'rxjs';
import { encryptWithBase64Key } from '../../../utils/crypto.utils';
import { KeyStorageService } from '../User/key-storage.service';
import {
  PasswordBody,
  PasswordType,
} from '../../../shared/interfaces/password.interface';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private http = inject(HttpClient);
  private keyService = inject(KeyStorageService);
  constructor() {}

  private $passwordList = new BehaviorSubject<IPassword[]>([]);
  $password = this.$passwordList.asObservable();

  setPasswords(value: IPassword[]) {
    if (value.length > 0) {
      this.$passwordList.next(value);
    } else {
      this.$passwordList.next([]);
    }
  }

  getPasswordApi(id: string) {
    return this.http.get<{ success: boolean; password: IPassword }>(
      '/user/password/get/' + id
    );
  }

  getPasswordsApi() {
    return this.http.get<{ success: boolean; passwords: IPassword[] }>(
      '/user/password/all/'
    );
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
    const encryptionKey = this.keyService.getDekKey() as string;

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
          category: password.category.value,
          notes: encryptedNotes,
        };
        return this.http.post<{ success: boolean; password: IPassword }>(
          '/user/password/add/',
          [sendPassword]
        );
      })
    );
  }

  editPasswordApi(password: PasswordBody & { _id: string }) {
    const encryptionKey = this.keyService.getDekKey() as string;

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
          category: password.category.value,
          notes: encryptedNotes,
        };
        return this.http.put<{ success: boolean; message: string }>(
          '/user/password/edit/' + password._id,
          sendPassword
        );
      })
    );
  }

  getDeletedPasswordsApi() {
    return this.http.get<{ success: boolean; passwords: IPassword[] }>(
      '/user/password/deletedpasswords'
    );
  }

  permenantDeletePassword(id: string) {
    return this.http.delete<{ success: boolean; message: string }>(
      '/user/password/premenantdelete/' + id
    );
  }
}

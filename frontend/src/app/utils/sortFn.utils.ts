import { DeletedPassword } from '../features/recycle-bin/recycle-bin.component';
import { IDecryptedPasswordShare } from '../shared/interfaces/PasswordShare.interface';
import { IDecryptedPassword } from '../shared/interfaces/password.interface';

// Extended type for decrypted passwords used in sorting
export type DecryptedPassword =
  | (IDecryptedPassword & {
      toggle: boolean;
    })
  | IDecryptedPasswordShare;

// Generic sort function type for password objects
export type PasswordSortFn<T = DecryptedPassword | DeletedPassword> = (
  a: T,
  b: T
) => number;

// Sort by days remaining (ascending)
export const sortByDaysAsc: PasswordSortFn<DeletedPassword> = (a, b) =>
  a.daysLeft - b.daysLeft;

// Sort by days remaining (descending)
export const sortByDaysDesc: PasswordSortFn<DeletedPassword> = (a, b) =>
  b.daysLeft - a.daysLeft;

// Sort by creation date (oldest to newest)
export const sortByDateAsc: PasswordSortFn<DecryptedPassword> = (a, b) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

// Sort by creation date (newest to oldest)
export const sortByDateDesc: PasswordSortFn<DecryptedPassword> = (a, b) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

// Sort by updated date (oldest to newest)
export const sortByUpdatedAsc: PasswordSortFn<DecryptedPassword> = (a, b) =>
  new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();

// Sort by updated date (newest to oldest)
export const sortByUpdatedDesc: PasswordSortFn<DecryptedPassword> = (a, b) =>
  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

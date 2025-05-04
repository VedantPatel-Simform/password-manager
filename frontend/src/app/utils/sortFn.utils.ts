import { DeletedPassword } from '../features/recycle-bin/recycle-bin.component';
import { IDecryptedPassword } from '../shared/interfaces/password.interface';
type DecryptedPassword = IDecryptedPassword & {
  toggle: boolean;
};

// sort by days remaining
export const sortByDaysAsc = (a: DeletedPassword, b: DeletedPassword) =>
  a.daysLeft - b.daysLeft;

export const sortByDaysDesc = (a: DeletedPassword, b: DeletedPassword) =>
  b.daysLeft - a.daysLeft;

// Sort by createdAt (oldest to newest)
export const sortByDateAsc = (a: DecryptedPassword, b: DecryptedPassword) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

// Sort by createdAt (newest to oldest)
export const sortByDateDesc = (a: DecryptedPassword, b: DecryptedPassword) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

// Sort by updatedAt (oldest to newest)
export const sortByUpdatedAsc = (a: DecryptedPassword, b: DecryptedPassword) =>
  new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();

// Sort by updatedAt (newest to oldest)
export const sortByUpdatedDesc = (a: DecryptedPassword, b: DecryptedPassword) =>
  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

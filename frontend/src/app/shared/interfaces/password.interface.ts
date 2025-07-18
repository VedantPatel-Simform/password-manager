export interface IEncryptedField {
  cipherText: string;
  iv: string; // base64 encoded : 12 bytes
}
export type CategoryValue =
  | 'social_media'
  | 'work_professional'
  | 'banking_finance'
  | 'entertainment'
  | 'personal'
  | 'education'
  | 'shopping_ecommerce'
  | 'health_fitness'
  | 'travel_tourism'
  | 'other';
export interface IPassword {
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  userId: string;
  website: string;
  userName: string;
  email: string;
  password: IEncryptedField;
  category: CategoryValue;
  notes?: IEncryptedField;
  deleted: boolean;
  deletedTimeStamp?: Date;
  autoDeleteDate?: Date;
}

export interface PasswordBody {
  website: string;
  userName: string;
  email: string;
  password: string;
  category: {
    label: string;
    value: CategoryValue;
  };
  notes?: string;
}

export interface EncryptedPasswordBody {
  website: string;
  userName: string;
  email: string;
  password: IEncryptedField;
  category: CategoryValue;
  notes?: IEncryptedField;
}

export type PasswordType = Pick<
  IPassword,
  'email' | 'website' | 'userName' | 'password' | 'category' | 'notes'
>;

export interface IDecryptedPassword {
  createdAt: Date;
  updatedAt: Date;
  _id: string;
  userId: string;
  website: string;
  userName: string;
  email: string;
  password: string;
  category: CategoryValue;
  notes?: string;
  deleted: boolean;
  deletedTimeStamp?: Date;
  autoDeleteDate?: Date;
}

export interface IPasswordCsvItem {
  website: string;
  userName: string;
  email: string;
  password: string;
  category: CategoryValue;
  notes?: string;
}

export interface IPasswordCsvRow {
  [key: string]: string | undefined;
  website?: string;
  userName?: string;
  email?: string;
  password?: string;
  category?: string;
  notes?: string;
}

export interface INormalizedPasswordCsvRow {
  [key: string]: string | undefined;
  website: string;
  userName: string;
  email: string;
  password: string;
  category?: string;
  notes?: string;
}

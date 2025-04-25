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
  category: CategoryValue;
  notes?: string;
}

export type PasswordType = Omit<
  IPassword,
  'userId' | 'deleted' | 'deletedTimeStamp' | 'autoDeleteDate'
>;

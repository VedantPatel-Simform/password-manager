import { Injectable, inject, signal } from '@angular/core';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';
import {
  CategoryValue,
  IPasswordCsvItem,
  IPasswordCsvRow,
  INormalizedPasswordCsvRow,
  IPassword,
  EncryptedPasswordBody,
} from '../../shared/interfaces/password.interface';
import { categoryPatterns } from './categoryPatterns.constants';
import { encryptWithBase64Key } from '../../utils/crypto.utils';
import { KeyStorageService } from '../../core/services/User/key-storage.service';
import { HttpClient } from '@angular/common/http';
import { AppErrorHandler } from '../../shared/classes/AppError.handler';

@Injectable({
  providedIn: 'root',
})
export class UploadCsvService {
  private keyService = inject(KeyStorageService);
  private http = inject(HttpClient);

  private success = new BehaviorSubject<{
    success?: boolean;
    message?: string;
  }>({});
  success$ = this.success.asObservable();
  private readonly validCategories: CategoryValue[] = [
    'social_media',
    'work_professional',
    'banking_finance',
    'entertainment',
    'personal',
    'education',
    'shopping_ecommerce',
    'health_fitness',
    'travel_tourism',
    'other',
  ];

  private readonly keyMappings: { [key: string]: string } = {
    site: 'website',
    web: 'website',
    url: 'website',
    username: 'userName',
    user: 'userName',
    login: 'userName',
    mail: 'email',
    pass: 'password',
    pwd: 'password',
    secret: 'password',
    type: 'category',
    group: 'category',
    comment: 'notes',
    description: 'notes',
  };

  private readonly requiredFields = [
    'website',
    'userName',
    'email',
    'password',
    'category',
    'notes',
  ];

  private sendPasswordApi(passwords: EncryptedPasswordBody[]) {
    return this.http.post<{
      success: true;
      message: string;
    }>('/user/password/add/', passwords);
  }

  private uploadFile(file: File): Promise<IPasswordCsvItem[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            console.log('results = ', results);
            const validatedData = this.validateAndTransformCsvData(
              results.data as IPasswordCsvRow[]
            );
            resolve(validatedData);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(
            new AppErrorHandler(
              'File Error',
              `CSV parsing failed: ${error.message}`
            )
          );
        },
      });
    });
  }

  private async encryptPassword(
    password: IPasswordCsvItem
  ): Promise<EncryptedPasswordBody> {
    const key = this.keyService.getDekKey()!;
    const encPass = await encryptWithBase64Key(key, password.password);
    const encNotes =
      password.notes !== undefined
        ? await encryptWithBase64Key(key, password.notes)
        : undefined;

    return {
      ...password,
      password: encPass,
      notes: encNotes,
    };
  }

  private async encryptPasswords(data: IPasswordCsvItem[]) {
    const key = this.keyService.getDekKey()!;
    const encryptedPasswords = data.map((d) => this.encryptPassword(d));
    return await Promise.all(encryptedPasswords);
  }

  public async processFile(file: File) {
    const passwords = await this.uploadFile(file);
    const encryptedPasswords = await this.encryptPasswords(passwords);
    this.sendPasswordApi(encryptedPasswords).subscribe((value) => {
      this.success.next({
        success: true,
        message: value.message,
      });
    });
  }

  private readonly websiteRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/;

  private readonly emailRegex = /^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/;

  // ... [keep existing keyMappings and requiredFields] ...

  private validatePasswordItem(item: any, index: number): IPasswordCsvItem {
    // Validate required fields presence (excluding notes which is optional)
    const requiredFields = [
      'website',
      'userName',
      'email',
      'password',
      'category',
      // 'notes' - intentionally omitted from required fields
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        item[field] === undefined || item[field] === null || item[field] === ''
    );

    if (missingFields.length > 0) {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1} missing required fields: ${missingFields.join(', ')}`
      );
    }

    // Validate website
    if (typeof item.website !== 'string' || item.website.trim() === '') {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1}: website must be a non-empty string`
      );
    }
    if (!this.websiteRegex.test(item.website)) {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1}: invalid website format`
      );
    }

    // Validate userName
    if (typeof item.userName !== 'string' || item.userName.trim() === '') {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1}: userName must be a non-empty string`
      );
    }

    // Validate email
    if (typeof item.email !== 'string' || item.email.trim() === '') {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1}: email must be a non-empty string`
      );
    }
    if (!this.emailRegex.test(item.email)) {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1}: invalid email format`
      );
    }

    // Validate password
    if (typeof item.password !== 'string' || item.password.trim() === '') {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1}: password must be a non-empty string`
      );
    }

    // Validate category
    if (typeof item.category !== 'string') {
      throw new AppErrorHandler(
        'Validation Error',
        `Row ${index + 1}: category must be one of: ${this.validCategories.join(
          ', '
        )}`
      );
    }

    // Validate notes (optional)
    if (item.notes !== undefined && item.notes !== null) {
      if (typeof item.notes !== 'string') {
        throw new AppErrorHandler(
          'Validation Error',
          `Row ${index + 1}: notes must be a string if provided`
        );
      }
    }

    return {
      website: item.website.trim(),
      userName: item.userName.trim(),
      email: item.email.trim().toLowerCase(),
      password: item.password,
      category: this.inferCategory(item.category),
      notes: item.notes ? item.notes.trim() : undefined, // Will be undefined if not provided
    };
  }

  private validateAndTransformCsvData(
    csvData: IPasswordCsvRow[]
  ): IPasswordCsvItem[] {
    if (!Array.isArray(csvData)) {
      throw new AppErrorHandler('File Error', 'CSV data must be an array');
    }

    if (csvData.length === 0) {
      throw new AppErrorHandler('File Empty', 'CSV file is empty');
    }

    const allKeysValid = csvData.every((data) => {
      const dataKeys = Object.keys(data);
      const ans =
        this.requiredFields.every((key) => dataKeys.includes(key)) && // all required fields present
        dataKeys.every((key) => this.requiredFields.includes(key)); // no extra fields
      console.log(ans, '->', data);
      return ans;
    });

    if (!allKeysValid) {
      throw new AppErrorHandler('File format error', "Some column's missing");
    }
    return csvData.map((row, index) => {
      const normalizedRow = this.normalizeRowKeys(row);
      return this.validatePasswordItem(normalizedRow, index);
    });
  }

  private inferCategory(category: string): CategoryValue {
    // Check if explicit category is valid

    const lowerCategory = category.trim().toLowerCase();

    // First try exact match (case insensitive)
    const exactMatch = this.validCategories.find(
      (cat) => cat.toLowerCase() === lowerCategory
    );
    if (exactMatch) return exactMatch;

    // Then try partial match with more flexible comparison
    const matchedCategory = this.validCategories.find((cat) => {
      const categoryWithoutUnderscore = cat.replace('_', '').toLowerCase();
      return (
        lowerCategory.includes(categoryWithoutUnderscore) ||
        categoryWithoutUnderscore.includes(lowerCategory)
      );
    });

    if (matchedCategory) return matchedCategory;

    // Infer from website content
    const myCategory = category.trim().toLowerCase() || '';
    for (const [category, pattern] of Object.entries(categoryPatterns)) {
      if (pattern.test(myCategory)) {
        return category as CategoryValue;
      }
    }

    return 'other';
  }

  private normalizeRowKeys(row: IPasswordCsvRow): INormalizedPasswordCsvRow {
    return Object.keys(row).reduce((acc, key) => {
      const normalizedKey = key.toLowerCase().trim();
      const mappedKey = this.keyMappings[normalizedKey] || normalizedKey;
      acc[mappedKey] = row[key];
      return acc;
    }, {} as INormalizedPasswordCsvRow);
  }
}

import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';
import {
  CategoryValue,
  IPasswordCsvItem,
  IPasswordCsvRow,
  INormalizedPasswordCsvRow,
} from '../../shared/interfaces/password.interface';
import { categoryPatterns } from './categoryPatterns.constants';

@Injectable({
  providedIn: 'root',
})
export class UploadCsvService {
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
  ];

  private uploadFile(file: File): Promise<IPasswordCsvItem[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const validatedData = this.validateAndTransformCsvData(
              results.data as IPasswordCsvRow[]
            );
            resolve(validatedData);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        },
      });
    });
  }

  public async processFile(file: File) {
    const passwords = await this.uploadFile(file);
    console.log(passwords);
  }

  private validateAndTransformCsvData(
    csvData: IPasswordCsvRow[]
  ): IPasswordCsvItem[] {
    return csvData.map((row, index) => {
      const normalizedRow = this.normalizeRowKeys(row);
      this.validateRequiredFields(normalizedRow, index);

      return {
        website: normalizedRow.website.trim(),
        userName: normalizedRow.userName.trim(),
        email: normalizedRow.email.trim().toLowerCase(),
        password: normalizedRow.password,
        category: this.inferCategory(normalizedRow),
        notes: normalizedRow.notes?.trim(),
      };
    });
  }

  private validateRequiredFields(
    row: INormalizedPasswordCsvRow,
    rowIndex: number
  ): void {
    const missingFields = this.requiredFields.filter((field) => !row[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `Row ${rowIndex + 1} missing required fields: ${missingFields.join(
          ', '
        )}`
      );
    }
  }

  private inferCategory(row: INormalizedPasswordCsvRow): CategoryValue {
    // Check if explicit category is valid
    if (row.category) {
      const lowerCategory = row.category.trim().toLowerCase();

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
    }

    // Infer from website content
    const myCategory = (row.category as string)?.trim().toLowerCase() || '';
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

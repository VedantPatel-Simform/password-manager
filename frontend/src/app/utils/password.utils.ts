import zxcvbn, { ZXCVBNFeedbackWarning } from 'zxcvbn';
import { calculatePasswordEntropy } from './crypto.utils';
import { words } from '../core/constants/passphrase';
type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

export interface PasswordAnalysis {
  strength: PasswordStrength;
  crackTime: string | number;
  entropy: number;
  feedbackWarning: ZXCVBNFeedbackWarning;
  feedbackSuggestions: string[];
}

export function analyzePassword(password: string): PasswordAnalysis {
  const result = zxcvbn(password);
  const score = result.score; // 0–4
  const crackTime =
    result.crack_times_display.offline_slow_hashing_1e4_per_second;

  return {
    strength: mapZxcvbnScore(score),
    crackTime: crackTime,
    entropy: calculatePasswordEntropy(password),
    feedbackWarning: result.feedback.warning,
    feedbackSuggestions: result.feedback.suggestions,
  };
}

export function generatePassword(
  length: number,
  useUpper: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string {
  const charset = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    number: '0123456789',
    symbol: '!@#$%^&*()_+[]{}|;:,.<>?',
  };

  let pool = charset.lower; // Lowercase always included

  if (useUpper) pool += charset.upper;
  if (useNumbers) pool += charset.number;
  if (useSymbols) pool += charset.symbol;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    password += pool[randomIndex];
  }

  return password;
}

// using the diceware method from EFF
export function generatePassphrase(
  wordCount: number = 6,
  separator: string = ' ',
  numberCount: number = 0
): string {
  const getRandomDiceRoll = (): number => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 6) + 1;
  };

  const generateDiceKey = (): string => {
    let key = '';
    for (let i = 0; i < 5; i++) {
      key += getRandomDiceRoll().toString();
    }
    return key;
  };

  const getRandomDigit = (): number => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 10; // 0–9
  };

  const passphraseWords: string[] = [];

  while (passphraseWords.length < wordCount) {
    const diceKey = generateDiceKey();
    const word = words[diceKey];
    if (word) {
      passphraseWords.push(word);
    }
  }

  let passphrase = passphraseWords.join(separator);

  if (numberCount > 0) {
    const digits = Array.from({ length: numberCount }, () =>
      getRandomDigit()
    ).join('');
    passphrase += `${separator}${digits}`;
  }

  return passphrase;
}

function mapZxcvbnScore(score: number): PasswordStrength {
  switch (score) {
    case 0:
    case 1:
      return 'weak';
    case 2:
      return 'medium';
    case 3:
      return 'strong';
    case 4:
    default:
      return 'very-strong';
  }
}

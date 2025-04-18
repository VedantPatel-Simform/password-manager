import zxcvbn, { ZXCVBNFeedbackWarning } from 'zxcvbn';
import { calculatePasswordEntropy } from './crypto.utils';

type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

export interface PasswordAnalysis {
  strength: PasswordStrength;
  crackTime: string | number;
  entropy: number;
  feedbackWarning: ZXCVBNFeedbackWarning;
  feedbackSuggestions: string[];
}

export function analyzePassword(
  password: string,
  hasUppercase: boolean,
  hasNumber: boolean,
  hasSymbol: boolean
): PasswordAnalysis {
  const result = zxcvbn(password);
  const score = result.score; // 0–4
  const rawCrackTime =
    result.crack_times_display.offline_slow_hashing_1e4_per_second;
  //   const crackSeconds = BigInt(
  //     Math.floor(
  //       typeof rawCrackTime === 'string' ? parseFloat(rawCrackTime) : rawCrackTime
  //     )
  //   );

  return {
    strength: mapZxcvbnScore(score),
    crackTime: rawCrackTime,
    entropy: calculatePasswordEntropy(password),
    feedbackWarning: result.feedback.warning,
    feedbackSuggestions: result.feedback.suggestions,
  };
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

function formatCrackTime(seconds: bigint): string {
  const minute = 60n;
  const hour = 60n * minute;
  const day = 24n * hour;
  const month = 30n * day;
  const year = 365n * day;
  const thousand = 1_000n;
  const lakh = 100_000n;
  const million = 1_000_000n;
  const billion = 1_000_000_000n;
  const trillion = 1_000_000_000_000n;

  const yearFromSec = seconds / year;

  if (yearFromSec >= trillion)
    return `${yearFromSec / trillion} trillion years`;
  if (yearFromSec >= billion) return `${yearFromSec / billion} billion years`;
  if (yearFromSec >= million) return `${yearFromSec / million} million years`;
  if (yearFromSec >= lakh) return `${yearFromSec / lakh} lakh years`;
  if (yearFromSec >= thousand)
    return `${yearFromSec / thousand} thousand years`;
  if (yearFromSec >= 1n) return `${yearFromSec} years`;

  const monthFromSec = seconds / month;
  if (monthFromSec >= 1n) return `${monthFromSec} months`;

  const dayFromSec = seconds / day;
  if (dayFromSec >= 1n) return `${dayFromSec} days`;

  const hourFromSec = seconds / hour;
  if (hourFromSec >= 1n) return `${hourFromSec} hours`;

  const minuteFromSec = seconds / minute;
  if (minuteFromSec >= 1n) return `${minuteFromSec} minutes`;

  return `${seconds} seconds`;
}

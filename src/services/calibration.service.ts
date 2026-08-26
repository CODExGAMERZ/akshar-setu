import { CalibrationChoice, CalibrationResult, CalibrationStep, ReadingProfile } from '@/types';
import { CALIBRATION_ROUNDS_DATA, computeCalibratedProfile } from '@/lib/calibration/engine';
import { StorageService } from '@/lib/storage';

export class CalibrationService {
  /**
   * Retrieves calibration question rounds (Section 8 of Specification).
   */
  public static getCalibrationSteps(): CalibrationStep[] {
    return CALIBRATION_ROUNDS_DATA;
  }

  /**
   * Computes recommended reading profile based on user's choices.
   */
  public static computeProfile(choices: CalibrationChoice[], currentProfile: ReadingProfile): ReadingProfile {
    return computeCalibratedProfile(choices, currentProfile);
  }

  /**
   * Saves calibration result locally and updates active profile.
   */
  public static saveCalibrationResult(result: CalibrationResult): void {
    StorageService.saveProfile(result.recommendedProfile);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('akshar_last_calibration', JSON.stringify(result));
      } catch (err) {
        console.warn('Failed to save calibration result:', err);
      }
    }
  }

  /**
   * Retrieves last completed calibration result.
   */
  public static getLastCalibrationResult(): CalibrationResult | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem('akshar_last_calibration');
      if (data) return JSON.parse(data);
    } catch {
      // Ignore
    }
    return null;
  }
}

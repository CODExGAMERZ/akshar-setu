import { ReadingPreferences, ReadingProfile } from '../types';
import { DEFAULT_READING_PREFERENCES } from '../data/themes';

const PROFILE_STORAGE_KEY = 'lexiease_user_profile_v1';
const CALIBRATED_STORAGE_KEY = 'lexiease_calibrated_profile_v1';

class ProfileService {
  private currentProfile: ReadingProfile | null = null;

  private getProfileInternal(): ReadingProfile {
    if (this.currentProfile) return this.currentProfile;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored) {
          this.currentProfile = JSON.parse(stored);
          return this.currentProfile!;
        }
      } catch (e) {
        console.warn('Failed to load profile from storage:', e);
      }
    }

    const defaultProfile: ReadingProfile = {
      id: 'profile_default',
      userId: 'user_alex',
      name: 'Alex (Personal Profile)',
      preferences: { ...DEFAULT_READING_PREFERENCES },
      updatedAt: new Date().toISOString()
    };

    this.currentProfile = defaultProfile;
    return defaultProfile;
  }

  public async getProfile(): Promise<ReadingProfile> {
    await new Promise(r => setTimeout(r, 40));
    const p = this.getProfileInternal();
    return JSON.parse(JSON.stringify(p));
  }

  public async saveProfile(profile: ReadingProfile): Promise<ReadingProfile> {
    this.currentProfile = {
      ...profile,
      updatedAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(this.currentProfile));
      } catch (e) {
        console.warn('Failed to persist profile:', e);
      }
    }
    return this.currentProfile;
  }

  public async updatePreferences(preferences: Partial<ReadingPreferences>): Promise<ReadingProfile> {
    const prof = this.getProfileInternal();
    this.currentProfile = {
      ...prof,
      preferences: {
        ...prof.preferences,
        ...preferences
      },
      updatedAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(this.currentProfile));
      } catch (e) {
        console.warn('Failed to persist profile preferences:', e);
      }
    }
    return this.currentProfile;
  }

  public async saveCalibratedProfile(preferences: ReadingPreferences, answers: Record<string, string>): Promise<ReadingProfile> {
    const prof = this.getProfileInternal();
    this.currentProfile = {
      ...prof,
      preferences: { ...preferences },
      calibratedAt: new Date().toISOString(),
      calibrationAnswers: answers,
      updatedAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(this.currentProfile));
        localStorage.setItem(CALIBRATED_STORAGE_KEY, JSON.stringify(preferences));
      } catch (e) {
        console.warn('Failed to save calibrated settings:', e);
      }
    }
    return this.currentProfile;
  }

  public async resetToCalibrated(): Promise<ReadingPreferences> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CALIBRATED_STORAGE_KEY);
        if (stored) {
          const cal = JSON.parse(stored);
          await this.updatePreferences(cal);
          return cal;
        }
      } catch (e) {
        console.warn('No calibrated settings found, falling back to defaults:', e);
      }
    }
    await this.updatePreferences(DEFAULT_READING_PREFERENCES);
    return { ...DEFAULT_READING_PREFERENCES };
  }

  public async resetToDefaults(): Promise<ReadingPreferences> {
    await this.updatePreferences(DEFAULT_READING_PREFERENCES);
    return { ...DEFAULT_READING_PREFERENCES };
  }

  public exportProfileJSON(): string {
    const prof = this.getProfileInternal();
    return JSON.stringify(prof, null, 2);
  }

  public async importProfileJSON(jsonStr: string): Promise<ReadingProfile> {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.preferences) throw new Error('Invalid profile schema');
    return this.saveProfile(parsed);
  }
}

export const profileService = new ProfileService();

import { ReadingProfile } from '@/types';
import { DEFAULT_READING_PROFILE } from '@/lib/constants';
import { StorageService } from '@/lib/storage';

export class ProfileService {
  /**
   * Retrieves user's global reading profile from localStorage.
   */
  public static getProfile(): ReadingProfile {
    return StorageService.getProfile();
  }

  /**
   * Saves updates to user's global reading profile.
   */
  public static saveProfile(profile: ReadingProfile): void {
    StorageService.saveProfile(profile);
  }

  /**
   * Saves per-document override preferences (Section 30 of Specification).
   */
  public static saveDocumentOverride(docId: string, override: Partial<ReadingProfile>): ReadingProfile {
    const current = this.getProfile();
    const existingOverrides = current.documentSpecificOverrides || {};
    const updatedOverrides = {
      ...existingOverrides,
      [docId]: {
        ...(existingOverrides[docId] || {}),
        ...override,
      },
    };

    const updatedProfile: ReadingProfile = {
      ...current,
      documentSpecificOverrides: updatedOverrides,
      updatedAt: new Date().toISOString(),
    };

    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  /**
   * Gets effective profile for a specific document (global merged with per-doc override).
   */
  public static getEffectiveProfile(docId?: string): ReadingProfile {
    const globalProfile = this.getProfile();
    if (!docId || !globalProfile.documentSpecificOverrides || !globalProfile.documentSpecificOverrides[docId]) {
      return globalProfile;
    }
    return {
      ...globalProfile,
      ...globalProfile.documentSpecificOverrides[docId],
    };
  }

  /**
   * Resets profile to system default.
   */
  public static resetToDefaults(): ReadingProfile {
    StorageService.saveProfile(DEFAULT_READING_PROFILE);
    return DEFAULT_READING_PROFILE;
  }
}

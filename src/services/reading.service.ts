import { ReadingSession } from '@/types';

export class ReadingService {
  private static activeSessions: Map<string, ReadingSession> = new Map();

  /**
   * Starts a reading session to track metrics (time, speed, confusable letters).
   */
  public static startSession(documentId: string): ReadingSession {
    const session: ReadingSession = {
      sessionId: `session_${Date.now()}`,
      documentId,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      wordsRead: 0,
      readingSpeedWpm: 0,
      confusableLetterInteractionsCount: 0,
    };
    this.activeSessions.set(documentId, session);
    return session;
  }

  /**
   * Updates session metrics.
   */
  public static updateSession(
    documentId: string,
    updates: Partial<Omit<ReadingSession, 'sessionId' | 'documentId' | 'startTime'>>
  ): void {
    const existing = this.activeSessions.get(documentId);
    if (existing) {
      Object.assign(existing, updates);
    }
  }

  /**
   * Concludes session and persists summary locally.
   */
  public static endSession(documentId: string): ReadingSession | null {
    const session = this.activeSessions.get(documentId);
    if (!session) return null;
    session.endTime = new Date().toISOString();
    const durationSec = Math.max(
      1,
      Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
    );
    session.durationSeconds = durationSec;
    if (session.wordsRead > 0) {
      session.readingSpeedWpm = Math.round((session.wordsRead / durationSec) * 60);
    }
    this.activeSessions.delete(documentId);
    return session;
  }
}

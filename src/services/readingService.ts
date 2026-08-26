import { ReadingSession } from '../types';

class ReadingService {
  private activeSession: ReadingSession | null = null;
  private timerInterval: number | null = null;

  public startSession(documentId: string, totalWords: number): ReadingSession {
    this.endSession(); // End any previous session

    this.activeSession = {
      documentId,
      startTime: Date.now(),
      elapsedSeconds: 0,
      wordsRead: 0,
      wpm: 0,
      difficultWordsLookedUp: [],
      completed: false
    };

    if (typeof window !== 'undefined') {
      this.timerInterval = window.setInterval(() => {
        if (this.activeSession) {
          this.activeSession.elapsedSeconds++;
          if (this.activeSession.wordsRead > 0 && this.activeSession.elapsedSeconds > 5) {
            this.activeSession.wpm = Math.round((this.activeSession.wordsRead / this.activeSession.elapsedSeconds) * 60);
          }
        }
      }, 1000) as unknown as number;
    }

    return this.activeSession;
  }

  public recordWordRead(count: number = 1) {
    if (this.activeSession) {
      this.activeSession.wordsRead += count;
    }
  }

  public recordDifficultWord(word: string) {
    if (this.activeSession && !this.activeSession.difficultWordsLookedUp.includes(word)) {
      this.activeSession.difficultWordsLookedUp.push(word);
    }
  }

  public endSession(): ReadingSession | null {
    if (this.timerInterval && typeof window !== 'undefined') {
      window.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    const session = this.activeSession;
    this.activeSession = null;
    return session;
  }

  public getActiveSession(): ReadingSession | null {
    return this.activeSession;
  }
}

export const readingService = new ReadingService();

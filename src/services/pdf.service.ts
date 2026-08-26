export class PDFService {
  /**
   * Cleans raw extracted PDF text into clean, reflowed paragraphs
   */
  public static cleanPDFText(rawText: string): string {
    return rawText
      // Replace excessive consecutive newlines
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      // Join broken lines within paragraphs while keeping real paragraph breaks
      .split('\n\n')
      .map((paragraph) =>
        paragraph
          .replace(/([a-zA-Z0-9,;:])\n([a-zA-Z0-9])/g, '$1 $2')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter((p) => p.length > 0)
      .join('\n\n');
  }
}

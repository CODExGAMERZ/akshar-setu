export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function getFontFamilyCSS(fontName: string): string {
  switch (fontName) {
    case 'Lexend':
      return "'Lexend', sans-serif";
    case 'Atkinson Hyperlegible':
      return "'Atkinson Hyperlegible', sans-serif";
    case 'OpenDyslexic':
      return "'OpenDyslexic', 'Lexend', sans-serif";
    case 'Comic Neue':
      return "'Comic Neue', cursive, sans-serif";
    case 'Arial':
      return "Arial, Helvetica, sans-serif";
    case 'Verdana':
      return "Verdana, Geneva, sans-serif";
    case 'Lora':
      return "'Lora', serif";
    default:
      return "'Lexend', sans-serif";
  }
}

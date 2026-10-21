export const palette: Record<string, string> = {
  '08': '#8E1B3A',
  '17': '#C2621B',
  '26': '#6E7F5A',
  '35': '#B5782A',
  '44': '#B4506A',
  '53': '#4A3326',
  '62': '#C9B92E',
  '80': '#6B4A3A',
};

export const fallbackColor = '#6D5F7E';

export function getFragranceColor(number: string): string {
  return palette[number] ?? fallbackColor;
}

import { DateTime } from "luxon";

export const ansiColors: Record<string, number> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  purple: 35,
  cyan: 36,
  white: 37
};

export function timestamp(time?: number) {
  const dt = time ? DateTime.fromMillis(time) : DateTime.now();
  return dt.toFormat("MM/dd/yy @ hh:mm:ss a");
};

export function prettyLog(name: string, color: keyof typeof ansiColors, text: string) {
  const maxLength = 8;
  const trimmed = name.slice(0, maxLength);

  const paddedName = trimmed.padEnd(maxLength, " ");
  const colorCode = ansiColors[color] || ansiColors.white;

  console.log(`${timestamp()} | \x1b[${colorCode}m\x1b[1m${paddedName}\x1b[0m » ${text}`);
};
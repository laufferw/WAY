// Pythagorean numerology calculations.

const MASTER = new Set([11, 22, 33]);
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

const digitSum = (n) => String(n).split('').reduce((s, d) => s + Number(d), 0);

/** Reduce to a single digit, preserving master numbers unless keepMaster is false. */
export function reduce(n, keepMaster = true) {
  while (n > 9 && !(keepMaster && MASTER.has(n))) n = digitSum(n);
  return n;
}

export const letterValue = (ch) => ((ch.charCodeAt(0) - 65) % 9) + 1;

/** Upper-case Latin letters only, with accents stripped, split into name parts. */
export function nameParts(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .split(/[^A-Z]+/)
    .filter(Boolean);
}

/** Y counts as a vowel when it is not next to another vowel (e.g. "Lynn", "Mary"). */
function isVowel(word, i) {
  const ch = word[i];
  if (VOWELS.has(ch)) return true;
  if (ch !== 'Y') return false;
  return !VOWELS.has(word[i - 1]) && !VOWELS.has(word[i + 1]);
}

function sumParts(parts, pick) {
  const total = parts.reduce((acc, word) => {
    let s = 0;
    for (let i = 0; i < word.length; i++) if (pick(word, i)) s += letterValue(word[i]);
    return acc + reduce(s);
  }, 0);
  return reduce(total);
}

export function computeNumerology(name, { year, month, day }, currentYear = new Date().getFullYear()) {
  const parts = nameParts(name);
  const lifePath = reduce(reduce(month) + reduce(day) + reduce(digitSum(year)));
  const expression = sumParts(parts, () => true);
  const soulUrge = sumParts(parts, isVowel);
  const personality = sumParts(parts, (w, i) => !isVowel(w, i));
  const birthDay = reduce(day);
  const maturity = reduce(reduce(lifePath, false) + reduce(expression, false));
  const personalYear = reduce(month + day + digitSum(currentYear), false);
  return { lifePath, expression, soulUrge, personality, birthDay, maturity, personalYear, currentYear, hasName: parts.length > 0 };
}

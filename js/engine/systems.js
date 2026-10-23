// Determines each system's sign/number from the birth data.

import { julianDay, sunLongitude, moonLongitude, ascendant, zodiacPosition } from './astronomy.js';
import { lunarNewYear } from './lunar-new-year.js';
import { computeNumerology } from './numerology.js';
import { CELTIC } from '../content/celtic.js';
import { TOTEMS } from '../content/native.js';

const ELEMENT_BY_STEM = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

/** Offset (ms) of an IANA time zone from UTC at a given instant. */
function zoneOffset(timeZone, ts) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  }).formatToParts(new Date(ts));
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')) - ts;
}

/**
 * Converts a local wall-clock time to a UTC Date.
 * Uses the IANA zone when known, otherwise a fixed offset in hours (default 0).
 */
export function localToUtc({ year, month, day, hour, minute }, { timeZone, utcOffset = 0 } = {}) {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  if (!timeZone) return new Date(wall - utcOffset * 3600000);
  let utc = wall - zoneOffset(timeZone, wall);
  utc = wall - zoneOffset(timeZone, utc);
  return new Date(utc);
}

const md = (m, d) => m * 100 + d;

function inRange(month, day, [sm, sd], [em, ed]) {
  const v = md(month, day), s = md(sm, sd), e = md(em, ed);
  return s <= e ? v >= s && v <= e : v >= s || v <= e;
}

export function celticSign(month, day) {
  return CELTIC.find((c) => inRange(month, day, c.start, c.end));
}

export function nativeTotem(month, day, southern = false) {
  const m = southern ? ((month + 5) % 12) + 1 : month;
  return TOTEMS.find((t) => inRange(m, day, t.start, t.end));
}

export function chineseSign(year, month, day) {
  const ny = lunarNewYear(year);
  const beforeNewYear = ny ? md(month, day) < md(ny.month, ny.day) : false;
  const lunarYear = beforeNewYear ? year - 1 : year;
  const stem = (((lunarYear - 4) % 10) + 10) % 10;
  const branch = (((lunarYear - 4) % 12) + 12) % 12;
  return {
    lunarYear, stem, branch, animalIndex: branch,
    element: ELEMENT_BY_STEM[stem], polarity: stem % 2 === 0 ? 'Yang' : 'Yin',
    beforeNewYear, newYear: ny, outOfRange: !ny,
  };
}

/**
 * Computes every system for a person.
 * input: { name, year, month, day, time?: 'HH:MM', place?: { label, lat, lon, timeZone, utcOffset } }
 */
export function computeSystems(input) {
  const { year, month, day, name } = input;
  const place = input.place || {};
  const zone = { timeZone: place.timeZone, utcOffset: place.utcOffset };
  const hasTime = Boolean(input.time);
  const [hour, minute] = hasTime ? input.time.split(':').map(Number) : [12, 0];

  const instant = localToUtc({ year, month, day, hour, minute }, zone);
  const jd = julianDay(instant);
  const sun = zodiacPosition(sunLongitude(jd));
  const moon = zodiacPosition(moonLongitude(jd));

  // Without a birth time, check whether the Sun or Moon changed sign during the day.
  let sunAlternatives = [], moonAlternatives = [];
  if (!hasTime) {
    const start = julianDay(localToUtc({ year, month, day, hour: 0, minute: 0 }, zone));
    const end = julianDay(localToUtc({ year, month, day, hour: 23, minute: 59 }, zone));
    sunAlternatives = [...new Set([zodiacPosition(sunLongitude(start)).index, zodiacPosition(sunLongitude(end)).index])];
    moonAlternatives = [...new Set([zodiacPosition(moonLongitude(start)).index, zodiacPosition(moonLongitude(end)).index])];
  }

  const hasCoords = Number.isFinite(place.lat) && Number.isFinite(place.lon);
  const rising = hasTime && hasCoords ? zodiacPosition(ascendant(jd, place.lat, place.lon)) : null;
  const southern = input.hemisphere ? input.hemisphere === 'south' : hasCoords && place.lat < 0;

  return {
    instant, hasTime, hasCoords, southern,
    sun, moon, rising,
    sunUncertain: sunAlternatives.length > 1 ? sunAlternatives : null,
    moonUncertain: moonAlternatives.length > 1 ? moonAlternatives : null,
    decan: Math.min(2, Math.floor(sun.degree / 10)),
    chinese: chineseSign(year, month, day),
    celtic: celticSign(month, day),
    native: nativeTotem(month, day, southern),
    numerology: computeNumerology(name, { year, month, day }, input.currentYear),
  };
}

// Low-precision positional astronomy (after Meeus, "Astronomical Algorithms").
// Accuracy is well within what sign placement needs: Sun ~0.01°, Moon ~0.1°.

const RAD = Math.PI / 180;
const norm360 = (x) => ((x % 360) + 360) % 360;

/** Julian Day for a JS Date (UTC instant). */
export function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

const centuries = (jd) => (jd - 2451545.0) / 36525;

/** Apparent geocentric ecliptic longitude of the Sun, in degrees. */
export function sunLongitude(jd) {
  const T = centuries(jd);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * RAD;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * RAD;
  return norm360(L0 + C - 0.00569 - 0.00478 * Math.sin(omega));
}

// Principal periodic terms for the Moon's longitude (Meeus table 47.A),
// as [D, M, M', F, coefficient in 1e-6 degrees].
const MOON_TERMS = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
];

/** Geocentric ecliptic longitude of the Moon, in degrees. */
export function moonLongitude(jd) {
  const T = centuries(jd);
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = (297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) * RAD;
  const M = (357.5291092 + 35999.0502909 * T - 0.0001536 * T * T) * RAD;
  const Mp = (134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) * RAD;
  const F = (93.272095 + 483202.0175233 * T - 0.0036539 * T * T) * RAD;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  let sum = 0;
  for (const [d, m, mp, f, c] of MOON_TERMS) {
    const eFactor = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1;
    sum += c * eFactor * Math.sin(d * D + m * M + mp * Mp + f * F);
  }
  const A1 = (119.75 + 131.849 * T) * RAD;
  const A2 = (53.09 + 479264.29 * T) * RAD;
  sum += 3958 * Math.sin(A1) + 1962 * Math.sin(Lp * RAD - F) + 318 * Math.sin(A2);
  return norm360(Lp + sum / 1e6);
}

/** Mean obliquity of the ecliptic, in degrees. */
export function obliquity(jd) {
  const T = centuries(jd);
  return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

/** Local sidereal time in degrees for a longitude (east positive). */
export function localSiderealTime(jd, lonDeg) {
  const T = centuries(jd);
  const gmst =
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  return norm360(gmst + lonDeg);
}

/** Ecliptic longitude of the Ascendant, in degrees. */
export function ascendant(jd, latDeg, lonDeg) {
  const ramc = localSiderealTime(jd, lonDeg) * RAD;
  const eps = obliquity(jd) * RAD;
  const lat = latDeg * RAD;
  const asc = Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps)));
  return norm360(asc / RAD);
}

/** Sign index (0 = Aries … 11 = Pisces) and degree within the sign for a longitude. */
export function zodiacPosition(lon) {
  const l = norm360(lon);
  return { index: Math.floor(l / 30), degree: l % 30, longitude: l };
}

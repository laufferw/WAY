import { test } from 'node:test';
import assert from 'node:assert/strict';
import { julianDay, sunLongitude, moonLongitude, localSiderealTime, ascendant, zodiacPosition } from '../js/engine/astronomy.js';
import { computeSystems, localToUtc, chineseSign, celticSign, nativeTotem } from '../js/engine/systems.js';
import { computeNumerology, reduce } from '../js/engine/numerology.js';
import { buildProfile } from '../js/engine/profile.js';
import { profileHtml, profileMarkdown } from '../js/render.js';
import { WESTERN } from '../js/content/western.js';
import { ANIMALS } from '../js/content/chinese.js';

const close = (a, b, tol) => assert.ok(Math.abs(a - b) < tol, `${a} not within ${tol} of ${b}`);

test('astronomy matches Meeus worked examples', () => {
  close(sunLongitude(2448908.5), 199.909, 0.01); // Example 25.a
  close(moonLongitude(2448724.5), 133.163, 0.05); // Example 47.a
  close(localSiderealTime(2446895.5, 0), 197.693, 0.001); // Example 12.a
  close(ascendant(2451545, 0, -localSiderealTime(2451545, 0)), 90, 1e-6); // RAMC 0 at equator → 0° Cancer
});

test('local wall-clock time converts to UTC using historical offsets', () => {
  assert.equal(localToUtc({ year: 2000, month: 7, day: 1, hour: 12, minute: 0 }, { timeZone: 'America/New_York' }).toISOString(), '2000-07-01T16:00:00.000Z');
  assert.equal(localToUtc({ year: 2000, month: 1, day: 1, hour: 12, minute: 0 }, { timeZone: 'America/New_York' }).toISOString(), '2000-01-01T17:00:00.000Z');
  assert.equal(localToUtc({ year: 2000, month: 1, day: 1, hour: 12, minute: 0 }, { utcOffset: 5.5 }).toISOString(), '2000-01-01T06:30:00.000Z');
});

test('Chinese sign respects Lunar New Year', () => {
  const before = chineseSign(1990, 1, 15); // LNY 1990 was Jan 27
  assert.equal(ANIMALS[before.animalIndex].name, 'Snake');
  assert.equal(before.element, 'Earth');
  const after = chineseSign(1990, 2, 1);
  assert.equal(ANIMALS[after.animalIndex].name, 'Horse');
  assert.equal(after.element, 'Metal');
  const goat = chineseSign(1907, 7, 6);
  assert.equal(`${goat.element} ${ANIMALS[goat.animalIndex].name}`, 'Fire Goat');
});

test('Celtic and medicine-wheel signs by date and hemisphere', () => {
  assert.equal(celticSign(1, 1).animal, 'Stag');
  assert.equal(celticSign(12, 24).animal, 'Stag');
  assert.equal(celticSign(9, 2).animal, 'Swan');
  assert.equal(celticSign(9, 30).tree, 'Ivy');
  assert.equal(nativeTotem(9, 3).animal, 'Brown Bear');
  assert.equal(nativeTotem(12, 25).animal, 'Snow Goose');
  assert.equal(nativeTotem(9, 3, true).animal, 'Wolf'); // six months on
});

test('numerology core numbers', () => {
  assert.equal(reduce(29), 11);
  assert.equal(reduce(29, false), 2);
  const n = computeNumerology('Ada', { year: 1815, month: 12, day: 10 }, 2026);
  assert.deepEqual([n.lifePath, n.expression, n.soulUrge, n.personality, n.birthDay], [1, 6, 2, 4, 1]);
  assert.equal(computeNumerology('Lynn', { year: 2000, month: 1, day: 1 }).soulUrge, 7); // Y as vowel
  assert.equal(computeNumerology('José', { year: 2000, month: 1, day: 1 }).expression, computeNumerology('Jose', { year: 2000, month: 1, day: 1 }).expression);
});

test('rising sign needs time and place, and cycles through all signs in a day', () => {
  const noTime = computeSystems({ name: 'A', year: 1990, month: 5, day: 5, place: { lat: 51.5, lon: -0.1, timeZone: 'Europe/London' } });
  assert.equal(noTime.rising, null);
  const signs = new Set();
  for (let h = 0; h < 24; h++) {
    const s = computeSystems({ name: 'A', year: 1990, month: 5, day: 5, time: `${String(h).padStart(2, '0')}:00`, place: { lat: 51.5, lon: -0.1, timeZone: 'Europe/London' } });
    signs.add(s.rising.index);
  }
  assert.equal(signs.size, 12);
});

test('cusp days without a birth time are flagged', () => {
  // The Sun entered Virgo on 23 Aug 1990 around 07:21 UTC.
  const s = computeSystems({ name: 'A', year: 1990, month: 8, day: 23, place: { timeZone: 'Europe/London' } });
  assert.deepEqual(s.sunUncertain, [4, 5]);
});

test('full profile builds, renders and exports for many dates', () => {
  for (let m = 1; m <= 12; m++) {
    for (const d of [1, 10, 20, 28]) {
      const p = buildProfile({ name: 'Sam Rivera', year: 1950 + m * 3, month: m, day: d, time: '06:30', place: { label: 'Sydney', lat: -33.87, lon: 151.21, timeZone: 'Australia/Sydney' } });
      assert.equal(p.sections.length, 7);
      assert.ok(p.archetype.startsWith('the '));
      const html = profileHtml(p);
      assert.ok(!html.includes('undefined'), `undefined in HTML for ${m}/${d}`);
      assert.ok(!profileMarkdown(p).includes('undefined'));
      for (const s of p.sections) for (const b of s.blocks) for (const para of b.paras || []) {
        assert.equal(typeof para, 'string');
        assert.ok(para.length > 20, `short paragraph in ${s.id}: ${para}`);
      }
    }
  }
});

test('profile escapes user-supplied text', () => {
  const p = buildProfile({ name: '<img src=x onerror=alert(1)>', year: 1980, month: 3, day: 3 });
  assert.ok(!profileHtml(p).includes('<img'));
});

test('sun sign dates in the library agree with the ephemeris', () => {
  const s = computeSystems({ name: 'A', year: 2001, month: 4, day: 1 });
  assert.equal(WESTERN[s.sun.index].name, 'Aries');
  assert.equal(zodiacPosition(sunLongitude(julianDay(new Date(Date.UTC(2001, 6, 1))))).index, 3);
});

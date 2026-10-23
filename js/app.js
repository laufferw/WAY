import { buildProfile } from './engine/profile.js';
import { profileHtml, profileMarkdown, inline } from './render.js';
import { CITIES } from './content/cities.js';
import { writeNarrative, narrativeHtml } from './ai.js';

// The single-file Artifact build sets this; that sandbox blocks printing, network calls and URL state.
const SANDBOXED = Boolean(window.__SANDBOXED__);
const GEOCODER = 'https://geocoding-api.open-meteo.com/v1/search';
const EXAMPLE = { name: 'Frida Kahlo', date: '1907-07-06', time: '', place: { label: 'Coyoacán, Mexico City, Mexico', lat: 19.35, lon: -99.16, timeZone: 'America/Mexico_City' } };

const $ = (id) => document.getElementById(id);
const form = $('birth-form');
const placeInput = $('place');
const suggestions = $('place-suggestions');
let chosenPlace = null;
let currentProfile = null;

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch { /* storage unavailable */ } },
};

// ── Time zones for the advanced fields ───────────────────────────
try {
  $('tz-list').innerHTML = Intl.supportedValuesOf('timeZone').map((z) => `<option value="${z}"></option>`).join('');
} catch { /* older browsers: free text still works */ }

// ── Place search ─────────────────────────────────────────────────
function localMatches(q) {
  const s = q.toLowerCase();
  return CITIES.filter(([n, r]) => n.toLowerCase().startsWith(s) || `${n}, ${r}`.toLowerCase().includes(s))
    .slice(0, 6)
    .map(([n, r, lat, lon, tz]) => ({ label: `${n}, ${r}`, lat, lon, timeZone: tz }));
}

async function remoteMatches(q) {
  if (SANDBOXED || q.length < 3) return [];
  try {
    const res = await fetch(`${GEOCODER}?name=${encodeURIComponent(q)}&count=6&language=en&format=json`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r) => ({
      label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
      lat: r.latitude, lon: r.longitude, timeZone: r.timezone,
    }));
  } catch {
    return [];
  }
}

let searchSeq = 0;
let searchTimer;
function showSuggestions(items) {
  suggestions.innerHTML = items.map((p, i) => `<li role="option" id="opt-${i}" data-i="${i}">${inline(p.label)}</li>`).join('');
  suggestions.hidden = items.length === 0;
  placeInput.setAttribute('aria-expanded', String(items.length > 0));
  suggestions._items = items;
}

placeInput.addEventListener('input', () => {
  chosenPlace = null;
  setPlaceStatus('');
  const q = placeInput.value.trim();
  if (!q) return showSuggestions([]);
  const local = localMatches(q);
  showSuggestions(local);
  clearTimeout(searchTimer);
  const seq = ++searchSeq;
  searchTimer = setTimeout(async () => {
    const remote = await remoteMatches(q);
    if (seq !== searchSeq) return;
    const seen = new Set(local.map((p) => p.label));
    showSuggestions([...local, ...remote.filter((p) => !seen.has(p.label))].slice(0, 8));
  }, 300);
});

function choosePlace(p) {
  chosenPlace = p;
  placeInput.value = p.label;
  $('lat').value = p.lat;
  $('lon').value = p.lon;
  $('tz').value = p.timeZone || '';
  setPlaceStatus(`${p.lat.toFixed(2)}°, ${p.lon.toFixed(2)}° · ${p.timeZone || 'time zone unknown'}`);
  showSuggestions([]);
}

suggestions.addEventListener('mousedown', (e) => {
  const li = e.target.closest('li');
  if (li) { e.preventDefault(); choosePlace(suggestions._items[Number(li.dataset.i)]); }
});
placeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !suggestions.hidden && suggestions._items?.length) {
    e.preventDefault();
    choosePlace(suggestions._items[0]);
  } else if (e.key === 'Escape') showSuggestions([]);
});
placeInput.addEventListener('blur', () => setTimeout(() => showSuggestions([]), 150));

function setPlaceStatus(text) {
  $('place-status').textContent = text;
}

// ── Building the profile ─────────────────────────────────────────
function readForm() {
  const [year, month, day] = $('birthdate').value.split('-').map(Number);
  const lat = parseFloat($('lat').value), lon = parseFloat($('lon').value);
  const tz = $('tz').value.trim();
  const offset = parseFloat($('utc-offset').value);
  const place = {
    label: placeInput.value.trim() || undefined,
    lat: Number.isFinite(lat) ? lat : undefined,
    lon: Number.isFinite(lon) ? lon : undefined,
    timeZone: tz && isValidZone(tz) ? tz : undefined,
    utcOffset: Number.isFinite(offset) ? offset : undefined,
  };
  const hemisphere = $('hemisphere').value;
  return {
    name: $('name').value.trim(), year, month, day,
    time: $('birthtime').value || undefined,
    place, hemisphere: hemisphere === 'auto' ? undefined : hemisphere,
  };
}

function isValidZone(tz) {
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch { return false; }
}

function validate(input) {
  if (!input.name) return 'Enter a name. It is used for the numerology section.';
  if (!input.year || !input.month || !input.day) return 'Enter a full birth date.';
  if (input.year < 1900 || input.year > 2099) return 'Birth years from 1900 to 2099 are supported.';
  if ($('tz').value.trim() && !input.place.timeZone) return 'That time zone was not recognised. Pick one from the list, such as Europe/London.';
  return '';
}

function render(input, { example = false } = {}) {
  currentProfile = buildProfile(input);
  $('profile').innerHTML = profileHtml(currentProfile);
  $('example-banner').hidden = !example;
  $('results').hidden = false;
  $('narrative').hidden = true;
  $('narrative-body').innerHTML = '';
  document.title = example ? 'Holistic Profile' : `${currentProfile.first} · Holistic Profile`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = readForm();
  const error = validate(input);
  $('form-error').textContent = error;
  if (error) return;
  render(input);
  if (!SANDBOXED) history.replaceState(null, '', `?${toQuery(input)}`);
  $('results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

// ── Shareable URLs (hosted build only) ───────────────────────────
function toQuery(input) {
  const q = new URLSearchParams({ n: input.name, d: `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')}` });
  if (input.time) q.set('t', input.time);
  if (input.place.label) q.set('p', input.place.label);
  if (input.place.lat !== undefined) q.set('lat', input.place.lat);
  if (input.place.lon !== undefined) q.set('lon', input.place.lon);
  if (input.place.timeZone) q.set('tz', input.place.timeZone);
  if (input.hemisphere) q.set('h', input.hemisphere);
  return q.toString();
}

function fillForm({ name, date, time, place, hemisphere }) {
  $('name').value = name || '';
  $('birthdate').value = date || '';
  $('birthtime').value = time || '';
  placeInput.value = place?.label || '';
  $('lat').value = place?.lat ?? '';
  $('lon').value = place?.lon ?? '';
  $('tz').value = place?.timeZone || '';
  $('hemisphere').value = hemisphere || 'auto';
  if (place?.lat !== undefined) setPlaceStatus(`${Number(place.lat).toFixed(2)}°, ${Number(place.lon).toFixed(2)}° · ${place.timeZone || 'time zone unknown'}`);
}

function boot() {
  const q = SANDBOXED ? new URLSearchParams() : new URLSearchParams(location.search);
  if (q.get('n') && q.get('d')) {
    fillForm({
      name: q.get('n'), date: q.get('d'), time: q.get('t'), hemisphere: q.get('h'),
      place: { label: q.get('p'), lat: q.has('lat') ? Number(q.get('lat')) : undefined, lon: q.has('lon') ? Number(q.get('lon')) : undefined, timeZone: q.get('tz') },
    });
    const input = readForm();
    if (!validate(input)) return render(input);
  }
  fillForm(EXAMPLE);
  render(readForm(), { example: true });
  fillForm({});
  setPlaceStatus('');
}

// ── Actions ──────────────────────────────────────────────────────
async function copy(text, button, done) {
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = done;
  } catch {
    $('copy-fallback').hidden = false;
    $('copy-fallback').value = text;
    $('copy-fallback').select();
    button.textContent = 'Select and copy below';
  }
  setTimeout(() => { button.textContent = original; }, 2200);
}

$('copy-text').addEventListener('click', (e) => currentProfile && copy(profileMarkdown(currentProfile), e.currentTarget, 'Copied'));
$('share-link').addEventListener('click', (e) => copy(location.href, e.currentTarget, 'Link copied'));
$('print').addEventListener('click', () => window.print());
if (SANDBOXED) {
  $('share-link').hidden = true;
  $('print').hidden = true;
  $('ai-panel').hidden = true;
}

// ── Optional Claude narrative ────────────────────────────────────
const keyInput = $('api-key');
keyInput.value = store.get('anthropic-key') || '';
$('remember-key').checked = Boolean(keyInput.value);
let aborter = null;

$('ai-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (aborter) { aborter.abort(); return; }
  const apiKey = keyInput.value.trim();
  if (!apiKey) { $('ai-status').textContent = 'Paste an Anthropic API key first.'; return; }
  if (!currentProfile) return;
  store.set('anthropic-key', $('remember-key').checked ? apiKey : '');
  const button = $('ai-go');
  const body = $('narrative-body');
  let text = '';
  aborter = new AbortController();
  button.textContent = 'Stop writing';
  $('narrative').hidden = false;
  body.innerHTML = '';
  $('ai-status').textContent = 'Claude is writing your narrative…';
  try {
    await writeNarrative({
      apiKey, profile: currentProfile, signal: aborter.signal,
      onText: (delta) => { text += delta; body.innerHTML = narrativeHtml(text, inline); },
    });
    $('ai-status').textContent = 'Narrative complete.';
  } catch (err) {
    $('ai-status').textContent = aborter.signal.aborted ? 'Stopped.' : `Could not write the narrative: ${err.message}`;
  } finally {
    aborter = null;
    button.textContent = 'Write with Claude';
  }
});

boot();

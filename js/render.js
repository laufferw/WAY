// Turns a profile object into HTML, an SVG zodiac wheel and plain-text exports.

import { WESTERN } from './content/western.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Escapes text, then applies the tiny **bold** / *italic* markup. */
export const inline = (s) =>
  esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

const ELEMENT_CLASS = { Fire: 'fire', Earth: 'earth', Air: 'air', Water: 'water' };

/** SVG wheel showing the Sun, Moon and (if known) Ascendant. */
export function wheelSvg(systems) {
  const size = 320, c = size / 2, rOuter = 150, rInner = 112, rCore = 70;
  const ascLon = systems.rising ? systems.rising.longitude : 0;
  const pt = (lon, r) => {
    const a = ((180 + lon - ascLon) * Math.PI) / 180;
    return [c + r * Math.cos(a), c - r * Math.sin(a)];
  };
  const f = (n) => n.toFixed(1);
  let out = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Zodiac wheel showing the Sun${systems.rising ? ', Moon and Ascendant' : ' and Moon'}" class="wheel">`;
  for (let i = 0; i < 12; i++) {
    const s = i * 30, e = s + 30;
    const [x1, y1] = pt(s, rOuter), [x2, y2] = pt(e, rOuter), [x3, y3] = pt(e, rInner), [x4, y4] = pt(s, rInner);
    out += `<path class="seg ${ELEMENT_CLASS[WESTERN[i].element]}${i === systems.sun.index ? ' active' : ''}" d="M${f(x1)} ${f(y1)} A${rOuter} ${rOuter} 0 0 0 ${f(x2)} ${f(y2)} L${f(x3)} ${f(y3)} A${rInner} ${rInner} 0 0 1 ${f(x4)} ${f(y4)}Z"/>`;
    const [gx, gy] = pt(s + 15, (rOuter + rInner) / 2);
    out += `<text class="glyph" x="${f(gx)}" y="${f(gy)}">${WESTERN[i].glyph}︎</text>`;
  }
  for (let d = 0; d < 360; d += 5) {
    const [x1, y1] = pt(d, rInner), [x2, y2] = pt(d, rInner - (d % 30 === 0 ? 10 : 4));
    out += `<line class="tick" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>`;
  }
  out += `<circle class="core" cx="${c}" cy="${c}" r="${rCore}"/>`;
  if (systems.rising) {
    const [ax, ay] = pt(ascLon, rInner), [dx, dy] = pt(ascLon + 180, rInner);
    out += `<line class="horizon" x1="${f(ax)}" y1="${f(ay)}" x2="${f(dx)}" y2="${f(dy)}"/>`;
    out += `<text class="label" x="${f(ax + 16)}" y="${f(ay - 6)}">ASC</text>`;
  }
  const planet = (lon, glyph, cls, r) => {
    const [px, py] = pt(lon, r), [lx, ly] = pt(lon, rInner);
    return `<line class="ray ${cls}" x1="${f(lx)}" y1="${f(ly)}" x2="${f(px)}" y2="${f(py)}"/><circle class="dot ${cls}" cx="${f(px)}" cy="${f(py)}" r="13"/><text class="pglyph" x="${f(px)}" y="${f(py)}">${glyph}︎</text>`;
  };
  out += planet(systems.moon.longitude, '☽', 'moon', 86);
  out += planet(systems.sun.longitude, '☉', 'sun', 92);
  return out + '</svg>';
}

function block(b) {
  let h = '';
  if (b.note) return `<p class="note">${inline(b.note)}</p>`;
  if (b.heading) h += `<h4>${inline(b.heading)}</h4>`;
  for (const p of b.paras || []) h += `<p>${inline(p)}</p>`;
  if (b.list) h += `<ul class="core-list">${b.list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`;
  if (b.items) {
    h += '<ol class="themes">' + b.items.map((it) =>
      `<li><div class="theme-head"><strong>${inline(it.title)}</strong><span class="count">${it.sources.length} system${it.sources.length > 1 ? 's' : ''}</span></div>` +
      `<p>${inline(it.text)}</p><div class="chips">${it.sources.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></li>`).join('') + '</ol>';
  }
  return `<div class="block">${h}</div>`;
}

export function profileHtml(profile) {
  const glance = profile.glance.map(([k, v]) => `<div class="row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  const nav = profile.sections.map((s) => `<a href="#${s.id}">${esc(s.kicker)}</a>`).join('');
  const sections = profile.sections.map((s) => `
    <section class="sys" id="${s.id}">
      <header>
        <p class="kicker">${esc(s.kicker)}</p>
        <h3>${esc(s.title)}</h3>
        ${s.subtitle ? `<p class="sub">${esc(s.subtitle)}</p>` : ''}
        ${s.keywords ? `<div class="chips">${s.keywords.map((k) => `<span class="chip">${esc(k)}</span>`).join('')}</div>` : ''}
      </header>
      ${s.blocks.map(block).join('')}
      ${s.footnote ? `<p class="footnote">${esc(s.footnote)}</p>` : ''}
    </section>`).join('');
  return `
    <header class="profile-head">
      <p class="kicker">Holistic Profile</p>
      <h2>${esc(profile.first)}’s Holistic Astrological Profile</h2>
      <p class="epithet">In a phrase: <em>${esc(profile.archetype)}</em></p>
    </header>
    <div class="overview">
      <dl class="glance">${glance}</dl>
      <figure class="wheel-wrap">${wheelSvg(profile.systems)}
        <figcaption>Sun ☉ and Moon ☽ at birth${profile.systems.rising ? ', with the horizon line through your Ascendant' : '. Add a birth time and place to orient the wheel to your Ascendant'}.</figcaption>
      </figure>
    </div>
    <nav class="toc" aria-label="Profile sections">${nav}</nav>
    ${sections}`;
}

/** Plain-text (Markdown) version of the profile for copying. */
export function profileMarkdown(profile) {
  let md = `# ${profile.first}’s Holistic Astrological Profile\n\n`;
  md += profile.glance.map(([k, v]) => `**${k}:** ${v}`).join('  \n') + '\n\n';
  for (const s of profile.sections) {
    md += `## ${s.kicker}: ${s.title}\n`;
    if (s.subtitle) md += `*${s.subtitle}*\n`;
    md += '\n';
    for (const b of s.blocks) {
      if (b.note) md += `> ${b.note}\n\n`;
      if (b.heading) md += `### ${b.heading}\n\n`;
      for (const p of b.paras || []) md += `${p}\n\n`;
      if (b.list) md += b.list.map((li) => `- ${li}`).join('\n') + '\n\n';
      if (b.items) md += b.items.map((it) => `- **${it.title}** (${it.sources.join(', ')}): ${it.text}`).join('\n') + '\n\n';
    }
    if (s.footnote) md += `*${s.footnote}*\n\n`;
  }
  return md.trim() + '\n';
}

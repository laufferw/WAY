// Builds the full holistic profile (a structured document) from birth data.
// Paragraph strings use a tiny markup: **bold** and *italic*.

import { computeSystems } from './systems.js';
import { WESTERN, MOON_SIGN, RISING_SIGN, DECANS, DECAN_TITLES, planetNote } from '../content/western.js';
import { ANIMALS, ELEMENTS, STEMS, BRANCHES } from '../content/chinese.js';
import { TOTEMS, CLANS } from '../content/native.js';
import { NUMBERS, PERSONAL_YEAR } from '../content/numerology.js';
import { DAYS, DECAN_PHASE } from '../content/birthday.js';
import { THEMES, CHALLENGES, TENSIONS } from '../content/themes.js';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ORDINAL = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const WESTERN_INDEX = Object.fromEntries(WESTERN.map((w, i) => [w.name, i]));
const fmtMD = ([m, d]) => `${MONTHS[m - 1].slice(0, 3)} ${d}`;
const list = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);
const bold = (items) => items.map((s) => `**${s}**`);

export function buildProfile(input) {
  const sys = computeSystems(input);
  const name = input.name.trim();
  const first = name.split(/\s+/)[0];
  const dateLabel = `${MONTHS[input.month - 1]} ${input.day}, ${input.year}`;

  const sun = WESTERN[sys.sun.index];
  const animal = ANIMALS[sys.chinese.animalIndex];
  const element = ELEMENTS[sys.chinese.element];
  const celtic = sys.celtic;
  const totem = sys.native;
  const num = sys.numerology;
  const dayInfo = DAYS[input.day];
  const decanIdx = sys.sun.index * 3 + sys.decan;
  const [decanRuler, decanCard] = DECANS[decanIdx];
  const birthdayTitle = `The Day of the ${dayInfo[0]} ${DECAN_TITLES[sys.sun.index][sys.decan]}`;
  const chineseName = `${sys.chinese.element} ${animal.name}`;
  const lp = NUMBERS[num.lifePath];

  // Track which themes each system contributes, for cross-references and the synthesis.
  const tally = new Map();
  const challengeTally = new Map();
  const seen = [];
  const contribute = (source, themes = [], challenges = [], weight = 1) => {
    for (const t of themes) add(tally, t, source, weight);
    for (const c of challenges) add(challengeTally, c, source, weight);
  };
  function add(map, key, source, weight) {
    const entry = map.get(key) || { key, sources: [], weight: 0 };
    if (!entry.sources.includes(source)) entry.sources.push(source);
    entry.weight += weight;
    map.set(key, entry);
  }
  // Sentence noting how a new system echoes themes from systems already covered.
  const echo = (themes) => {
    for (const t of themes) {
      const prior = seen.find((s) => s.themes.includes(t));
      if (prior) return ` This echoes the ${THEMES[t].adj} quality already visible in your ${prior.label} profile.`;
    }
    return '';
  };
  const markSeen = (label, themes) => seen.push({ label, themes });

  const sections = [];

  // ── Western zodiac ─────────────────────────────────────────────
  const westernBlocks = [
    { heading: 'Personality & Traits', paras: [`Your Sun sign is **${sun.name}**, a ${sun.modality} ${sun.element} sign ruled by ${sun.ruler}. ${sun.personality}`] },
    { heading: 'Strengths', paras: [sun.strengths] },
    { heading: 'Weaknesses', paras: [sun.weaknesses] },
    {
      heading: 'Compatibility',
      paras: [`${sun.name} typically harmonises with ${list(bold(sun.best))}. ${sun.compatibility} Of course, any pairing can work with understanding; these are tendencies, not rules.`],
    },
  ];
  if (sys.sunUncertain) {
    const alt = sys.sunUncertain.map((i) => WESTERN[i].name);
    westernBlocks.unshift({ note: `You were born on a cusp day: the Sun moved from ${alt[0]} into ${alt[1]} during your birth date. Without a birth time this profile uses the noon position (${sun.name}); add your birth time for certainty.` });
  }
  const moonSign = WESTERN[sys.moon.index];
  const moonPara = sys.moonUncertain
    ? `The Moon changed sign on your birth date, moving from ${WESTERN[sys.moonUncertain[0]].name} to ${WESTERN[sys.moonUncertain[1]].name}. At midday it was in **${moonSign.name}**: ${MOON_SIGN[sys.moon.index]} Adding a birth time will confirm which applies.`
    : `Your Moon was in **${moonSign.name}**. ${MOON_SIGN[sys.moon.index]}`;
  const bigThree = { heading: 'Moon & Rising', paras: [moonPara] };
  if (sys.rising) {
    const r = WESTERN[sys.rising.index];
    bigThree.paras.push(`Your Rising sign (Ascendant) is **${r.name}** at ${sys.rising.degree.toFixed(0)}°. ${RISING_SIGN[sys.rising.index]}`);
  } else {
    bigThree.paras.push('*Add your birth time and birthplace to reveal your Rising sign, the mask you wear when meeting the world.*');
  }
  westernBlocks.push(bigThree);
  sections.push({
    id: 'western', kicker: 'Western Zodiac', title: `${sun.name} ${sun.glyph}\uFE0E`, subtitle: `${sun.archetype} · ${sun.element} · ${sun.modality} · ruled by ${sun.ruler}`,
    keywords: sun.keywords, blocks: westernBlocks,
  });
  contribute(sun.name, sun.themes, sun.challenges, 2);
  if (!sys.moonUncertain) contribute(`${moonSign.name} Moon`, moonSign.themes.slice(0, 1), [], 1);
  if (sys.rising) contribute(`${WESTERN[sys.rising.index].name} Rising`, WESTERN[sys.rising.index].themes.slice(0, 1), [], 1);
  markSeen(sun.name, sun.themes);

  // ── Chinese zodiac ─────────────────────────────────────────────
  const c = sys.chinese;
  const ganzhi = `${STEMS[c.stem]}${BRANCHES[c.branch]}`;
  const chineseIntro = `In Chinese astrology, ${c.lunarYear} was the Year of the ${animal.name}, specifically the **${chineseName}** (${ganzhi}, ${c.polarity}).` +
    (c.beforeNewYear ? ` Because you were born before Lunar New Year (${fmtMD([c.newYear.month, c.newYear.day])}, ${input.year}), you belong to the previous year’s sign.` : '') +
    (c.outOfRange ? ' (Lunar New Year data is unavailable for this year, so the calendar year is used.)' : '');
  const allies = [...animal.allies, animal.secretFriend];
  sections.push({
    id: 'chinese', kicker: 'Chinese Zodiac', title: `${chineseName} (${c.lunarYear})`, subtitle: `${ganzhi} · ${c.polarity} ${c.element}`,
    blocks: [
      { paras: [chineseIntro] },
      { heading: 'Personality', paras: [`${animal.personality} ${element.note}${echo(animal.themes)}`, animal.shadow] },
      { heading: 'Career & Talents', paras: [animal.career] },
      { heading: 'Relationships', paras: [animal.love, animal.social] },
      {
        heading: 'Compatibility',
        paras: [`The ${animal.name} belongs to the harmonious trio of ${list(bold([animal.name, ...animal.allies]))}, and its “secret friend” is the **${animal.secretFriend}**. Traditionally the most challenging match is the **${animal.clash}**, its opposite on the zodiac wheel. With understanding and effort any match can work, but these allies tend to share your values instinctively.`],
      },
    ],
  });
  contribute(chineseName, [...animal.themes, ...element.themes.slice(0, 1)], animal.challenges, 2);
  markSeen(chineseName, animal.themes);

  // ── Birthday signature ─────────────────────────────────────────
  sections.push({
    id: 'birthday', kicker: 'Birthday Signature', title: `“${birthdayTitle}”`, subtitle: `${MONTHS[input.month - 1]} ${ORDINAL(input.day)} · ${sun.name} decan ${sys.decan + 1} · ${sys.sun.degree.toFixed(1)}° ${sun.name}`,
    blocks: [
      { paras: [`Your birthday carries a signature of its own. On ${MONTHS[input.month - 1]} ${ORDINAL(input.day)} the Sun stood at about ${Math.floor(sys.sun.degree)}° ${sun.name}, in the ${['first', 'second', 'third'][sys.decan]} decan of the sign. ${DECAN_PHASE[sys.decan]}`] },
      { heading: 'The Day Itself', paras: [`${dayInfo[1]}${echo([dayInfo[2]])}`] },
      { heading: 'Decan Influence', paras: [`Your decan is traditionally ruled by **${decanRuler}**, which ${planetNote(decanRuler)}. In the tarot it corresponds to the **${decanCard}**, a card worth contemplating as a mirror of this part of your nature.`] },
      { heading: 'Strength & Challenge', paras: [`**Strength:** ${THEMES[dayInfo[2]].label}. **Challenge:** ${CHALLENGES[dayInfo[3]].label}. ${CHALLENGES[dayInfo[3]].text}`] },
    ],
  });
  contribute(`${MONTHS[input.month - 1]} ${ORDINAL(input.day)}`, [dayInfo[2]], [dayInfo[3]], 1);
  markSeen('birthday', [dayInfo[2]]);

  // ── Celtic zodiac ──────────────────────────────────────────────
  sections.push({
    id: 'celtic', kicker: 'Celtic Zodiac', title: `The ${celtic.animal}`, subtitle: `${fmtMD(celtic.start)} – ${fmtMD(celtic.end)} · Tree sign: ${celtic.tree}`,
    blocks: [
      { heading: 'Personality & Spiritual Meaning', paras: [`In modern Celtic animal astrology you are born under the **${celtic.animal}**. ${celtic.personality}${echo(celtic.themes)}`, celtic.tree_note] },
      { heading: 'Strengths', paras: [celtic.strengths] },
      { heading: 'Challenges', paras: [celtic.shadow] },
      { heading: 'Kindred Signs', paras: [`The ${celtic.animal} finds natural kinship with the ${list(bold(celtic.best))}.`] },
    ],
  });
  contribute(`Celtic ${celtic.animal}`, celtic.themes, celtic.challenges, 2);
  markSeen(`Celtic ${celtic.animal}`, celtic.themes);

  // ── Native American (medicine wheel) ───────────────────────────
  const clan = CLANS[totem.clan];
  const clanMates = TOTEMS.filter((t) => t.clan === totem.clan && t !== totem);
  const opposite = TOTEMS[(TOTEMS.indexOf(totem) + 6) % 12];
  sections.push({
    id: 'native', kicker: 'Native American Zodiac', title: `${totem.animal} (${totem.moon})`,
    subtitle: `${fmtMD(totem.start)} – ${fmtMD(totem.end)} · ${totem.clan} clan (${clan.element}) · ${totem.direction}${totem.alt !== totem.animal ? ` · also known as ${totem.alt}` : ''}`,
    blocks: [
      {
        paras: [`In the medicine-wheel astrology popularised by Sun Bear and Wabun, your birth falls under the **${totem.animal}** of the ${totem.moon}.` +
          (sys.southern ? ' Because you were born in the Southern Hemisphere, the wheel is turned six months to match your seasons.' : '')],
      },
      { heading: 'Personality & Traits', paras: [`${totem.personality}${echo(totem.themes)}`] },
      { heading: 'Strengths', paras: [`${totem.strengths} ${clan.note}`] },
      { heading: 'Weaknesses', paras: [totem.shadow] },
      { heading: 'Compatibility', paras: [`Fellow ${totem.clan}-clan totems, the ${list(bold(clanMates.map((t) => t.animal)))}, share your elemental nature and make natural allies. Your polarity on the wheel is the **${opposite.animal}**, whose contrasting qualities can either frustrate or complete you.`] },
      { heading: 'Life Path & Spiritual Lesson', paras: [`Your totem’s lesson: ${totem.lesson}`] },
    ],
    footnote: 'This system is a 20th-century synthesis inspired by Indigenous teachings, not the practice of any single Native nation.',
  });
  contribute(totem.animal, totem.themes, totem.challenges, 2);
  markSeen(totem.animal, totem.themes);

  // ── Numerology ─────────────────────────────────────────────────
  const core = [
    ['Life Path', num.lifePath, 'lp', 'from your full birth date'],
    ['Expression (Destiny)', num.expression, 'ex', 'from every letter of your name'],
    ['Soul Urge (Heart’s Desire)', num.soulUrge, 'su', 'from the vowels of your name'],
    ['Personality', num.personality, 'pe', 'from the consonants of your name'],
    ['Birth Day', input.day, 'bd', `from the ${ORDINAL(input.day)} day of the month`],
  ].filter(([, , key]) => num.hasName || key === 'lp' || key === 'bd');
  const numBlocks = [{ list: core.map(([label, n, key, from]) => `**${label}: ${n}** (${NUMBERS[key === 'bd' ? num.birthDay : n].title}), ${from}`) }];
  for (const [label, n, key] of core) {
    const meaning = NUMBERS[key === 'bd' ? num.birthDay : n];
    const text = meaning[key] || meaning.lp;
    numBlocks.push({ heading: `${label} ${n}: ${meaning.title}`, paras: [`${key === 'lp' ? meaning.essence + ' ' : ''}${text} Gifts: ${meaning.gifts}. Watch for: ${meaning.shadow}.`] });
    const w = key === 'lp' ? 2 : 1;
    contribute(`${label} ${n}`, key === 'lp' ? meaning.themes : meaning.themes.slice(0, 2), key === 'lp' ? meaning.challenges : [], w);
  }
  if (num.hasName && num.soulUrge !== num.personality) {
    numBlocks.push({ heading: 'Inner & Outer Self', paras: [`Your Soul Urge ${num.soulUrge} (${NUMBERS[num.soulUrge].keywords.join(', ')}) describes what you want inside, while your Personality ${num.personality} (${NUMBERS[num.personality].keywords.join(', ')}) is what others see first. When the two differ, people may meet one side of you and be surprised later by the other. Honouring both is part of your journey.`] });
  }
  numBlocks.push({ heading: `Personal Year ${num.personalYear} (${num.currentYear})`, paras: [`In numerology, ${num.currentYear} is for you ${PERSONAL_YEAR[num.personalYear]} Your Maturity number, ${num.maturity}, hints at what life increasingly calls you toward after midlife: ${NUMBERS[num.maturity].keywords.join(', ')}.`] });
  sections.push({ id: 'numerology', kicker: 'Numerology', title: `Life Path ${num.lifePath}: ${lp.title}`, subtitle: num.hasName ? `Name analysed: “${name}”` : 'Name not provided', blocks: numBlocks });

  // ── Synthesis ──────────────────────────────────────────────────
  const ranked = [...tally.values()].sort((a, b) => b.sources.length - a.sources.length || b.weight - a.weight);
  const strengths = ranked.slice(0, 5);
  const challengesRanked = [...challengeTally.values()].sort((a, b) => b.sources.length - a.sources.length || b.weight - a.weight).slice(0, 3);
  const topKeys = new Set(ranked.slice(0, 8).map((r) => r.key));
  const tensions = TENSIONS.filter(([a, b]) => topKeys.has(a) && topKeys.has(b)).slice(0, 2);

  const [t1, t2, t3] = ranked.map((r) => THEMES[r.key]);
  const adjTheme = t2 && t2.adj !== t1.noun ? t2 : t3 || t2;
  const archetype = `the ${adjTheme ? adjTheme.adj : ''} ${t1.noun}`.replace(/\s+/g, ' ');

  // Compatibility: map each system's favoured signs to Western equivalents and look for agreement.
  const votes = new Map();
  const vote = (sign, source) => {
    if (!sign || sign === sun.name) return;
    const v = votes.get(sign) || [];
    if (!v.includes(source)) v.push(source);
    votes.set(sign, v);
  };
  sun.best.forEach((s) => vote(s, 'Western'));
  allies.forEach((a) => vote(ANIMALS.find((x) => x.name === a).western, 'Chinese'));
  clanMates.forEach((t) => vote(t.western, 'Native American'));
  const confirmed = [...votes.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);

  const careers = [...new Set(strengths.slice(0, 3).flatMap((s) => THEMES[s.key].careers))].slice(0, 7);
  const lpTitle = lp.title.replace(/^The /, '').replace(/ \(Master Number\)$/, '');

  const synthesisBlocks = [
    {
      paras: [`Bringing these astrological and numerological insights together reveals a richly layered portrait of ${first}. At your core you are **${archetype}**. Across six independent systems, the qualities that recur most often are ${list(strengths.slice(0, 3).map((s) => THEMES[s.key].label.toLowerCase()))}. When different traditions keep describing the same person, those descriptions are worth taking seriously as a mirror.`],
    },
    { heading: 'Strengths that repeatedly emerge', items: strengths.map((s) => ({ title: THEMES[s.key].label, text: THEMES[s.key].text, sources: s.sources })) },
    { heading: 'Challenges & growth areas', items: challengesRanked.map((c) => ({ title: CHALLENGES[c.key].label, text: CHALLENGES[c.key].text, sources: c.sources })) },
  ];
  if (tensions.length) synthesisBlocks.push({ heading: 'Inner tensions to integrate', paras: tensions.map(([, , text]) => text) });
  synthesisBlocks.push({
    heading: 'Compatibility in summary',
    paras: [
      confirmed.length
        ? `Several systems independently point to the same kinds of people. ${confirmed.slice(0, 3).map(([sign, src]) => `**${sign}** energy is favoured by your ${list(src)} profiles`).join('; ')}. This cross-system agreement suggests you thrive with people who share those qualities.`
        : `Your Western sign favours ${list(bold(sun.best.slice(0, 2)))}, your Chinese sign favours the ${list(bold(allies))}, and your totem finds kinship with the ${list(bold(clanMates.map((t) => t.animal)))}.`,
      `Above all, your best companions will appreciate your ${THEMES[strengths[0].key].adj} nature and respect your ${THEMES[(strengths[1] || strengths[0]).key].adj} side.`,
    ],
  });
  synthesisBlocks.push({
    heading: 'Life path fulfilment',
    paras: [`With a Life Path of ${num.lifePath} (${lpTitle}) and recurring themes of ${list(strengths.slice(0, 3).map((s) => THEMES[s.key].label.toLowerCase()))}, you may find the deepest fulfilment in work and roles involving ${list(careers)}. Whatever your path, your gift is to bring your ${THEMES[strengths[0].key].adj} nature to bear on something that matters to you.`],
  });
  synthesisBlocks.push({
    heading: 'In conclusion',
    paras: [
      `${first}, you are the ${sun.keywords[0]} ${sun.name}, the ${chineseName}, the “${dayInfo[0].toLowerCase()} ${DECAN_TITLES[sys.sun.index][sys.decan].toLowerCase()}” of ${MONTHS[input.month - 1]} ${ORDINAL(input.day)}, the ${celtic.animal} soul, the ${totem.animal} spirit and Life Path ${num.lifePath} ${lpTitle.toLowerCase()}, all in one.`,
      `In a phrase: **${archetype}**. Embracing every facet of your layered self, and letting others support you as you support them, will allow you to live with purpose and contentment.`,
    ],
  });
  sections.push({ id: 'synthesis', kicker: 'Integration', title: 'A Holistic Portrait', subtitle: 'Where the systems agree', blocks: synthesisBlocks });

  const glance = [
    ['Birth Date', dateLabel + (input.time ? ` · ${input.time}` : '')],
    input.place?.label ? ['Birthplace', input.place.label] : null,
    ['Western Zodiac', `${sun.name} (Sun)${sys.rising ? ` · ${WESTERN[sys.rising.index].name} Rising` : ''} · ${moonSign.name} Moon`],
    ['Chinese Zodiac', `${chineseName} (${ganzhi})`],
    ['Birthday Signature', birthdayTitle],
    ['Celtic Zodiac', `${celtic.animal} · ${celtic.tree}`],
    ['Native American Zodiac', `${totem.animal} (${totem.moon})`],
    ['Life Path Number', `${num.lifePath} (${lp.title})`],
  ].filter(Boolean);

  return { name, first, dateLabel, archetype, glance, sections, systems: sys };
}

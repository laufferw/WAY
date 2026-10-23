// Optional: asks Claude to write a long-form narrative from the computed profile.
// Runs entirely in the browser with the visitor's own Anthropic API key.

import { profileMarkdown } from './render.js';

const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.132.0/+esm';

const SYSTEM = `You write warm, insightful holistic astrology profiles. You are given a person's computed placements across six systems (Western zodiac, Chinese zodiac, a birthday signature, Celtic animal and tree, the Sun Bear medicine-wheel totem, and Pythagorean numerology) plus a draft synthesis.

Write an in-depth, flowing narrative profile in Markdown, addressed to the person in the second person ("you"). For each system cover personality, strengths, weaknesses or challenges, compatibility and life purpose, and keep pointing out where systems echo or contradict one another. You may also mention what "The Secret Language of Birthdays" by Gary Goldschneider and Joost Elffers says about this birth date, if you know it, clearly attributed. End with an "Integration & Conclusion" section that weaves everything together and closes with a single memorable phrase that sums the person up.

Use only the placements given; do not recompute or change them. Present astrology and numerology as reflective, traditional frameworks, not scientific fact. Use ## headings per system, **bold** for key traits and no tables.`;

/**
 * Streams a narrative. onText receives each text delta.
 * Returns the final message; throws on API errors.
 */
export async function writeNarrative({ apiKey, profile, onText, signal }) {
  const { default: Anthropic } = await import(SDK_URL);
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const stream = client.beta.messages.stream(
    {
      model: 'claude-opus-5-5',
      max_tokens: 32000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium' },
      system: SYSTEM,
      messages: [{ role: 'user', content: `Name: ${profile.name}\n\nComputed profile:\n\n${profileMarkdown(profile)}` }],
    },
    { signal },
  );
  stream.on('text', onText);
  const message = await stream.finalMessage();
  if (message.stop_reason === 'refusal') throw new Error('Claude declined to write this narrative. Try again or adjust the name.');
  return message;
}

/** Minimal Markdown → HTML for the narrative (headings, paragraphs, lists, bold, italic). */
export function narrativeHtml(md, inline) {
  const out = [];
  let listOpen = false;
  for (const raw of md.split('\n')) {
    const line = raw.trimEnd();
    const li = line.match(/^\s*[-*]\s+(.*)/);
    if (li) {
      if (!listOpen) { out.push('<ul>'); listOpen = true; }
      out.push(`<li>${inline(li[1])}</li>`);
      continue;
    }
    if (listOpen) { out.push('</ul>'); listOpen = false; }
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) out.push(`<h${Math.min(h[1].length + 2, 5)}>${inline(h[2])}</h${Math.min(h[1].length + 2, 5)}>`);
    else if (line) out.push(`<p>${inline(line)}</p>`);
  }
  if (listOpen) out.push('</ul>');
  return out.join('');
}

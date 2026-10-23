// Shared vocabulary used to weave the individual systems into one synthesis.
// Every sign, totem and number is tagged with strength themes and challenge themes;
// the synthesis counts which ones recur across systems.

export const THEMES = {
  analytical: {
    label: 'Analytical Mind & Eye for Detail',
    adj: 'discerning', noun: 'analyst',
    text: 'You have a sharp mind that can take a problem apart and put it back together better. People rely on you to notice what others miss and to bring order where there was confusion.',
    careers: ['research', 'data and analysis', 'engineering', 'editing', 'diagnostics'],
  },
  nurturing: {
    label: 'Compassion & Care for Others',
    adj: 'caring', noun: 'guardian',
    text: 'Underneath whatever face you show the world sits a big heart. You feel others’ struggles keenly and your instinct is to help, often quietly and practically, before anyone has to ask.',
    careers: ['healthcare', 'teaching', 'counselling', 'social work', 'hospitality'],
  },
  independent: {
    label: 'Independence & Self-Direction',
    adj: 'self-directed', noun: 'pioneer',
    text: 'You need room to steer your own course. Given autonomy you become a self-starter who initiates projects, makes decisions and carries them through without waiting for permission.',
    careers: ['entrepreneurship', 'freelance work', 'leadership roles', 'consulting'],
  },
  creative: {
    label: 'Creativity & Imagination',
    adj: 'imaginative', noun: 'creator',
    text: 'An original, imaginative streak runs through you. It shows up in art and expression, but just as much in unconventional problem-solving and fresh ways of seeing ordinary things.',
    careers: ['the arts', 'design', 'writing', 'product innovation', 'performance'],
  },
  communicative: {
    label: 'Communication & Expression',
    adj: 'articulate', noun: 'messenger',
    text: 'You have a gift with words and ideas. You can explain the complicated simply, connect people to one another and persuade without forcing.',
    careers: ['writing', 'media', 'sales', 'teaching', 'public speaking'],
  },
  grounded: {
    label: 'Practicality & Groundedness',
    adj: 'grounded', noun: 'builder',
    text: 'You are anchored in the real world. Where others theorise, you build: steady habits, tangible results and sensible decisions make you a stabilising presence.',
    careers: ['operations', 'finance', 'craft and trades', 'project management', 'agriculture'],
  },
  intense: {
    label: 'Depth & Intensity',
    adj: 'deep', noun: 'alchemist',
    text: 'Nothing about you is shallow. You feel, commit and pursue with real intensity, and that depth lets you transform situations (and yourself) in ways lighter souls cannot.',
    careers: ['psychology', 'investigation', 'crisis work', 'research', 'strategy'],
  },
  intuitive: {
    label: 'Intuition & Perceptiveness',
    adj: 'perceptive', noun: 'seer',
    text: 'You read people and situations beneath the surface. Your gut often knows before your head can explain why, and learning to trust it is one of your quiet superpowers.',
    careers: ['counselling', 'the arts', 'negotiation', 'healing professions'],
  },
  adventurous: {
    label: 'Adventure & Optimism',
    adj: 'adventurous', noun: 'explorer',
    text: 'You are drawn toward horizons, new experiences, ideas and places. Your optimism and willingness to try things lift those around you and open doors others never knock on.',
    careers: ['travel', 'education', 'exploration and field work', 'startups'],
  },
  disciplined: {
    label: 'Discipline & Perseverance',
    adj: 'steadfast', noun: 'master',
    text: 'You can play the long game. Patience, persistence and the willingness to keep chipping away let you reach a level of mastery that talent alone never achieves.',
    careers: ['management', 'law', 'medicine', 'skilled trades', 'athletics'],
  },
  harmonious: {
    label: 'Diplomacy & Harmony',
    adj: 'gracious', noun: 'peacemaker',
    text: 'You have a natural sense of balance and fairness. You smooth tensions, see every side and create environments, relationships and spaces where people feel at ease.',
    careers: ['mediation', 'design', 'human resources', 'diplomacy', 'law'],
  },
  loyal: {
    label: 'Loyalty & Reliability',
    adj: 'dependable', noun: 'rock',
    text: 'People can count on you. You keep your word and your confidences, and you show up when it matters. That makes you a cornerstone in your family, friendships and workplace.',
    careers: ['any role built on trust', 'administration', 'security', 'stewardship'],
  },
  visionary: {
    label: 'Vision & Originality',
    adj: 'visionary', noun: 'visionary',
    text: 'You often see what could be before others do. Ahead-of-their-time ideas come naturally, and you are willing to challenge “how it’s always been done” to make room for something better.',
    careers: ['innovation', 'technology', 'social change', 'architecture', 'strategy'],
  },
  spiritual: {
    label: 'Wisdom & Spiritual Depth',
    adj: 'wise', noun: 'sage',
    text: 'There is a philosophical, even spiritual, undercurrent to you. You ask the big questions, seek meaning beyond the material and tend to grow into the role of mentor or guide.',
    careers: ['philosophy', 'teaching', 'ministry or chaplaincy', 'wellness', 'writing'],
  },
  ambitious: {
    label: 'Ambition & Leadership',
    adj: 'driven', noun: 'leader',
    text: 'You are built to achieve. Clear goals energise you, and others naturally look to you to set direction and keep standards high.',
    careers: ['executive leadership', 'business', 'politics', 'competitive fields'],
  },
  social: {
    label: 'Warmth & Social Ease',
    adj: 'warm-hearted', noun: 'connector',
    text: 'You have a way with people. Your warmth, humour and charm bring groups together, and your network is often your greatest asset.',
    careers: ['events', 'community building', 'sales', 'hospitality', 'public relations'],
  },
  resilient: {
    label: 'Resilience & Courage',
    adj: 'resilient', noun: 'warrior',
    text: 'You bounce back. Setbacks rarely keep you down for long, and when something you love is threatened you can summon surprising courage and strength.',
    careers: ['emergency services', 'advocacy', 'sports', 'turnaround roles'],
  },
  principled: {
    label: 'Integrity & a Strong Moral Compass',
    adj: 'principled', noun: 'champion',
    text: 'Fairness and honour are non-negotiable for you. You will not cut corners, you stand up for the underdog and others sense they can trust your judgement.',
    careers: ['law and justice', 'advocacy', 'compliance', 'journalism', 'non-profit work'],
  },
};

export const CHALLENGES = {
  perfectionism: { label: 'Perfectionism', text: 'High standards can turn into an inner critic that is never satisfied. Learning when “good enough” really is good enough will free a great deal of energy.' },
  overthinking: { label: 'Overthinking & Worry', text: 'A busy mind can loop on “what-ifs.” Practices that move you from analysis into action, or simply into the body, help break the cycle.' },
  stubbornness: { label: 'Stubbornness', text: 'Steadfastness can harden into refusing to budge. Staying curious about other viewpoints keeps your strength from becoming rigidity.' },
  impatience: { label: 'Impatience', text: 'You want things to happen now. Pausing before acting, and allowing others their own pace, prevents avoidable mistakes and friction.' },
  guardedness: { label: 'Emotional Guardedness', text: 'You tend to keep feelings under wraps. Letting trusted people see your vulnerable side deepens bonds rather than weakening you.' },
  'people-pleasing': { label: 'Over-giving & People-pleasing', text: 'Your helpfulness can become self-sacrifice. Boundaries and the willingness to ask for help yourself are essential, not selfish.' },
  restlessness: { label: 'Restlessness', text: 'The pull toward the next new thing can leave projects or relationships unfinished. Choosing a few commitments to see through brings real fulfilment.' },
  scattered: { label: 'Scattered Energy', text: 'So many interests and ideas can dilute your focus. Simple structures and priorities turn potential into accomplishment.' },
  possessiveness: { label: 'Possessiveness & Jealousy', text: 'Deep attachment can slide into control or suspicion. Trust, both given and earned, is the antidote.' },
  aloofness: { label: 'Aloofness', text: 'You can seem distant or detached even when you care. Showing warmth deliberately helps people see the heart behind the composure.' },
  workaholism: { label: 'Overwork', text: 'Drive and duty can crowd out rest and play. Scheduling joy as seriously as work is part of your path.' },
  indecision: { label: 'Indecision', text: 'Seeing every side can make choosing hard. Trusting your values as a tiebreaker helps you commit with confidence.' },
  moodiness: { label: 'Mood Swings', text: 'Strong feelings can sweep you along. Naming emotions and giving them healthy outlets keeps them from running the show.' },
  rigidity: { label: 'Resistance to Change', text: 'You love the familiar, which can make change feel threatening. Each time you step outside your comfort zone you grow markedly.' },
  escapism: { label: 'Escapism', text: 'When reality feels harsh you may retreat into fantasy or avoidance. Grounding routines help you engage without losing your sensitivity.' },
  pride: { label: 'Pride & Ego', text: 'Confidence can tip into needing to be right or admired. Humility and genuine curiosity keep your leadership trusted.' },
  bluntness: { label: 'Bluntness', text: 'Honesty without tact can wound. Pairing candour with kindness makes your truth easier to hear.' },
  procrastination: { label: 'Procrastination', text: 'You can put off what feels emotionally risky. Small, decisive steps keep meaningful opportunities from slipping past.' },
};

/** Pairs of themes that pull in different directions; used to surface inner tensions. */
export const TENSIONS = [
  ['independent', 'nurturing', 'Part of you deeply wants to go your own way, while another part is drawn to care for and serve others. Both needs are valid; you thrive when you lead *through* service, choosing paths where your personal calling also helps people.'],
  ['independent', 'loyal', 'You value freedom yet you are devoted once committed. The healthiest relationships for you combine deep loyalty with plenty of room to breathe.'],
  ['analytical', 'intuitive', 'Your logical mind and your intuitive gut both have a vote. Growth comes from letting intuition propose and analysis test, rather than letting one silence the other.'],
  ['adventurous', 'grounded', 'You crave both adventure and security. A stable home base from which to explore lets you enjoy the best of both worlds.'],
  ['social', 'intense', 'You can be the life of the room, yet you also need depth and privacy. Protect time to recharge so your social sparkle stays genuine.'],
  ['creative', 'disciplined', 'Your free-flowing imagination and your capacity for discipline are a formidable pair when they cooperate: structure is what lets your creativity ship.'],
  ['harmonious', 'principled', 'You love peace but will not trade away what is right. Learning to raise issues calmly lets you keep both harmony and integrity.'],
  ['visionary', 'grounded', 'You see the future and you know how to build. That combination of dreamer and doer is rare and powerful; trust it.'],
  ['ambitious', 'spiritual', 'Worldly achievement and inner meaning both call to you. Your fulfilment lies in success that serves something larger than yourself.'],
];

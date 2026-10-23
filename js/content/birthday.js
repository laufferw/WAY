// "Birthday Signature": an original day-specific profile built from the
// day of the month, the Sun's decan and its exact degree.
// [epithet, description, strength theme, challenge theme] for days 1–31.

export const DAYS = [
  null,
  ['Pioneering', 'People born on the 1st are self-starters who would rather lead than follow, with a strong need to make their own mark.', 'independent', 'impatience'],
  ['Gentle', 'The 2nd brings tact, sensitivity and a gift for partnership; you work best in tandem and read moods instantly.', 'harmonious', 'indecision'],
  ['Expressive', 'The 3rd brings a quick wit and a creative, communicative spark. You may be quiet at first, yet you are multi-talented and more than you appear on the surface.', 'creative', 'scattered'],
  ['Steadfast', 'The 4th brings a builder’s patience and a love of order. You make things that last and keep your word.', 'disciplined', 'rigidity'],
  ['Restless', 'The 5th brings curiosity, versatility and a thirst for experience. You learn by doing and adapt with ease.', 'adventurous', 'restlessness'],
  ['Devoted', 'The 6th brings warmth, responsibility and an eye for beauty. Home and loved ones are your anchor.', 'nurturing', 'people-pleasing'],
  ['Searching', 'The 7th brings a probing, philosophical mind. You need solitude to think and you rarely accept easy answers.', 'spiritual', 'aloofness'],
  ['Commanding', 'The 8th brings executive ability and resilience. You understand power and use it to get things done.', 'ambitious', 'workaholism'],
  ['Compassionate', 'The 9th brings idealism and broad sympathy. You feel connected to causes larger than yourself.', 'principled', 'people-pleasing'],
  ['Self-Made', 'The 10th brings confidence and a drive to succeed on your own terms.', 'independent', 'pride'],
  ['Inspired', 'The 11th, a master-number day, brings heightened intuition and the ability to inspire others.', 'intuitive', 'overthinking'],
  ['Radiant', 'The 12th brings charm, creativity and a gift for presenting ideas in a compelling way.', 'creative', 'scattered'],
  ['Unconventional', 'The 13th brings hard work in the service of original ideas, and a refusal to be put in a box.', 'visionary', 'stubbornness'],
  ['Versatile', 'The 14th brings adaptability and a hunger for change balanced by practical sense.', 'adventurous', 'restlessness'],
  ['Magnetic', 'The 15th brings warmth and magnetism; people are drawn to your generous, caring nature.', 'social', 'people-pleasing'],
  ['Contemplative', 'The 16th brings depth and introspection; life often teaches you through moments of sudden insight.', 'spiritual', 'guardedness'],
  ['Purposeful', 'The 17th brings ambition with integrity and a capacity for strategic thinking.', 'ambitious', 'workaholism'],
  ['Humanitarian', 'The 18th brings broad vision and a desire to improve the world around you.', 'principled', 'impatience'],
  ['Resilient', 'The 19th brings independence forged through experience; you learn to stand strong on your own.', 'resilient', 'pride'],
  ['Intuitive', 'The 20th brings emotional intelligence and a gift for understanding others.', 'intuitive', 'moodiness'],
  ['Sociable', 'The 21st brings charisma, creativity and an easy way with people.', 'social', 'scattered'],
  ['Visionary', 'The 22nd, a master-number day, brings the rare ability to turn big dreams into practical realities.', 'visionary', 'workaholism'],
  ['Spirited', 'The 23rd brings quick thinking, magnetism and a love of freedom.', 'communicative', 'restlessness'],
  ['Loyal', 'The 24th brings devotion, responsibility and a strong family sense.', 'loyal', 'people-pleasing'],
  ['Perceptive', 'The 25th brings analytical insight paired with strong intuition.', 'analytical', 'overthinking'],
  ['Masterful', 'The 26th brings organisational talent and a drive to build security.', 'disciplined', 'workaholism'],
  ['Wise', 'The 27th brings compassion, broad-mindedness and a teacher’s heart.', 'spiritual', 'moodiness'],
  ['Bold', 'The 28th brings leadership with a cooperative touch and an independent streak.', 'independent', 'stubbornness'],
  ['Luminous', 'The 29th brings deep intuition, idealism and emotional intensity.', 'intuitive', 'moodiness'],
  ['Creative', 'The 30th brings imagination, expressiveness and a sunny disposition.', 'creative', 'scattered'],
  ['Dedicated', 'The 31st brings practical creativity and a determined work ethic.', 'grounded', 'rigidity'],
];

/** Notes for the three decans of any sign: opening, middle, closing. */
export const DECAN_PHASE = [
  'In the first decan of the sign, the sign’s core qualities are expressed in their purest form.',
  'In the second decan, the sign’s qualities are coloured by a sister sign of the same element, adding nuance and range.',
  'In the third decan, the sign’s qualities reach maturity, carrying hints of what comes next in the zodiac.',
];

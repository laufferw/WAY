# Holistic Profile Template

This is the structure the generator follows. It was taken from a hand-written sample profile with every personal detail removed. Placeholders are in `{braces}`; each one is filled by the engine in `js/engine/profile.js`.

## Inputs

| Input | Required | Used for |
|---|---|---|
| Full name | yes | Numerology (Expression, Soul Urge, Personality) and the headings |
| Birth date | yes | Every system |
| Birth time | no | Exact Sun/Moon positions and the Rising sign |
| Birthplace | no | Time zone, Rising sign and hemisphere (the medicine-wheel totem shifts six months south of the equator) |

## Structure

### `{First name}`’s Holistic Astrological Profile

**At a glance**
- Birth date: `{Month D, YYYY}`
- Western zodiac: `{Sun sign}` (Sun), plus `{Moon sign}` Moon and `{Rising}` Rising when known
- Chinese zodiac: `{Element} {Animal}` (`{stem-branch characters}`)
- Birthday signature: “The Day of the `{day epithet}` `{decan archetype}`”
- Celtic zodiac: `{Animal}` (`{date range}`), tree sign `{Tree}`
- Native American zodiac: `{Totem}` (`{Moon name}`, `{date range}`)
- Life Path number: `{n}` (`{title}`)

### 1. Western Zodiac: `{Sign}` (`{archetype}`)
- **Personality & Traits**: element, modality, ruling planet, core drive
- **Strengths**
- **Weaknesses**: the flip side of the strengths, and the growth lesson
- **Compatibility**: best matches with the reasons, and challenging matches
- **Moon & Rising**: emotional nature, and how others first see you

### 2. Chinese Zodiac: `{Element} {Animal}` (`{lunar year}`)
- Intro: lunar year (adjusted for Lunar New Year) and how the element modifies the animal
- **Personality**: the animal plus the element, with its shadow side
- **Career & Talents**
- **Relationships**: love and social life
- **Compatibility**: allied trine, secret friend, clash sign, and links to the Western results

### 3. Birthday Profile: “`{title}`” (`{Month Dth}`)
- What the specific day suggests
- Unique personality insights, with a link back to other systems
- **Strengths** and **Weaknesses** for the day
- Summary line

> The sample used day names from *The Secret Language of Birthdays* (Goldschneider & Elffers). Those are copyrighted, so the generator uses an original *Birthday Signature* built from the day of the month and the Sun’s decan, degree, decan ruler and tarot card. The optional Claude narrative may still cite the book with attribution.

### 4. Celtic Zodiac: The `{Animal}` (`{date range}`)
- **Personality & Spiritual Meaning**, including the paired tree sign
- **Strengths**
- **Challenges**
- **Kindred signs**

### 5. Native American Zodiac: `{Totem}` (`{Moon name}`)
- Context: Sun Bear’s medicine wheel, moon, clan and element, direction
- **Personality & Traits**
- **Strengths**
- **Weaknesses**
- **Compatibility**: clan-mates and the polarity totem
- **Life Path & Spiritual Lesson**

### 6. Numerology: Life Path `{n}` and Core Numbers
- Core list: Life Path, Expression (Destiny), Soul Urge (Heart’s Desire), Personality, Birth Day
- One section per number: meaning, gifts and watch-outs
- **Inner & outer self**: when Soul Urge and Personality differ
- **Life Purpose & Challenges Synthesis**, plus Personal Year and Maturity number

### 7. Integration & Conclusion: A Holistic Portrait
- Core archetype (“the `{adjective}` `{noun}`”)
- **Strengths that repeatedly emerge**: top themes, each listing the systems that support it
- **Challenges & growth areas**: recurring challenge themes
- **Inner tensions**: pairs of strong themes that pull against each other
- **Compatibility in summary**: signs that several systems favour independently
- **Life path fulfilment**: suggested roles drawn from the strongest themes
- **In conclusion**: “`{Name}`, you are the `{Sun}`, the `{Element Animal}`, the `{birthday}`, the `{Celtic}` soul, the `{totem}` spirit and Life Path `{n}`, all in one.”

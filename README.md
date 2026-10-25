# Holistic Profile

A web app that anyone can use. You enter a name, birth date and birthplace (birth time is optional), and it generates a holistic astrological profile covering six systems. It then writes a synthesis showing where those systems agree.

| System | What is calculated |
|---|---|
| Western zodiac | Sun, Moon and (with a birth time) Rising sign, all computed astronomically |
| Chinese zodiac | Animal, element and yin/yang, using exact Lunar New Year dates (1900–2099) |
| Birthday signature | Day-of-month archetype, the Sun’s decan and degree, decan ruler and tarot card |
| Celtic zodiac | The 13 animal signs with their Ogham tree signs |
| Native American zodiac | Sun Bear medicine-wheel totem, moon, clan and direction; shifted for Southern Hemisphere births |
| Numerology | Life Path, Expression, Soul Urge, Personality, Birth Day, Maturity and Personal Year |

The **Integration** section tags every sign and number with themes such as *analytical*, *nurturing* or *visionary*. It ranks the strengths and challenges that recur across systems and flags inner tensions. It also finds compatible signs that several systems agree on, and sums the person up in a single phrase.

Everything runs in the browser and the app has no backend. Two features use the network:

- **Birthplace search** uses a built-in list of about 120 major cities. When the network allows, it also uses the free [Open-Meteo geocoder](https://open-meteo.com/en/docs/geocoding-api). You can always enter coordinates and a time zone yourself under *Coordinates & time zone*.
- **Go deeper with Claude** is optional. With an Anthropic API key, Claude expands the computed profile into a long narrative reading. The key is sent only from the visitor’s browser to Anthropic. It is stored on the device only if the visitor ticks *Remember*.

The structure of a generated profile is documented in [`docs/profile-template.md`](docs/profile-template.md).

## Run it

```bash
npm start            # serves the app at http://localhost:8000
```

The app is a static site, so any static host works. Pushes to `main` deploy it to GitHub Pages through `.github/workflows/deploy.yml`, which runs the tests and publishes the single-file build. To enable this, set *Settings → Pages → Source* to **GitHub Actions**. ES modules need to be served over HTTP. To get a single file that opens directly from disk, build it:

```bash
npm install
npm run build        # → dist/holistic-profile.html (self-contained)
```

`npm run build -- --sandboxed` builds a version for hosts that block network calls, printing and URL changes. That version hides the share link, printing and the Claude panel.

## Test

```bash
npm test
```

The tests check the astronomy against worked examples from Meeus, and check time-zone conversion, Lunar New Year boundaries, sign lookups, numerology (including master numbers and Y as a vowel) and the Rising-sign calculation. They also build and render profiles for 48 dates and check that user input is escaped.

## Project layout

```
index.html, css/styles.css   page and styles
js/app.js                    form, place search, rendering, actions
js/render.js                 profile → HTML, zodiac wheel SVG, Markdown export
js/ai.js                     optional Claude narrative (Anthropic SDK, browser)
js/engine/astronomy.js       Sun, Moon, sidereal time and Ascendant
js/engine/systems.js         works out each system from the birth data
js/engine/numerology.js      Pythagorean numerology
js/engine/profile.js         assembles sections and the cross-system synthesis
js/engine/lunar-new-year.js  Lunar New Year table, 1900–2099
js/content/*.js              text library for every sign, totem and number
```

## Notes

- Without a birth time the app uses the noon position. If the Sun or Moon changed sign that day, the profile says so.
- The medicine-wheel totems come from a 20th-century system by Sun Bear and Wabun. It is not the practice of any single Native nation, and the profile says so.
- Day names from *The Secret Language of Birthdays* are copyrighted, so the birthday section uses an original system instead.
- Astrology and numerology are presented as tools for reflection, not as fact.

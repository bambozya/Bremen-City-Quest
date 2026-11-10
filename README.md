# Bremen City Quest

A location-based text adventure through the old town of Bremen. Hinrich, the ghost of a bell-founder’s apprentice, guides you from the Sögestraße to the Schnoor in search of a lost bell; at each real-world point you answer questions about what you see and pick up items along the way. The cat of the Stadtmusikanten is watching what you take.

This is a revival of *CityQuest*, a 2012 university project (Mobile Text Adventure Games, SoSe 2012) originally built in C# for Windows Phone. The route and every quiz question are unchanged; the story around them was completed in 2026 with a real ending. The app is now a dependency-free mobile web app that runs on any phone.

## Play

Open `index.html` over HTTP (geolocation requires HTTPS or `localhost`):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

To test on a phone, host the folder on any HTTPS static host (GitHub Pages works) or use a tunnel such as `ngrok`.

- The game is in English and German. It picks the phone's language; switch any time under Settings, mid-game included.
- Answer the ghost by tapping one of the options. A wrong option is crossed out and the ghost gives a hint.
- Tap a message to skip the typing. Tap the ghost in the header to poke it.
- Progress is saved automatically in the browser.
- GPS is a help, not a gate: when the travel panel shows and you are already at the point, tap *I'm here*. The menu also has a *Jump to point* dropdown.

## Structure

| Path | Purpose |
|------|---------|
| `data/story.js` | All rooms, coordinates, questions, accepted answers, hints and items (English) |
| `data/story.de.js` | German texts, as an overlay on `story.js` with the same step order |
| `js/i18n.js` | Interface strings per language and the overlay merge |
| `js/engine.js` | Game logic: step machine, keyword matching, items, hints |
| `js/geo.js` | Distance, bearing, GPS watching, compass heading |
| `js/app.js` | UI, local-storage persistence, travel gating |
| `index.html`, `css/style.css` | Mobile-first single page |
| `assets/logo.png` | Logo |

## The route

| # | Point | Notes |
|---|-------|-------|
| 0 | Prologue | no location |
| 1 | Sögestraße | swineherd and pigs statue |
| 2 | Unser Lieben Frauen Kirchhof | |
| 3 | St. Petri Dom / Domshof | Spuckstein |
| 4 | Marktplatz | Roland, Stadtmusikanten |
| 5 | Böttcherstraße | Haus des Glockenspiels |
| 6 | Domsheide | Die Glocke |
| 7 | Lange Wieren | St. Johann |
| 8 | Schnoor entrance | Klaben, Beck’s |
| 9 | Schnoor | Katzen-Café, finale |

Coordinates in `data/story.js` are approximate and the radii (35–45 m) should be tuned on site. Only the *next* point is checked, so nearby points cannot be confused.

## Tests

```sh
node test/playthrough.js
```

Checks that the German overlay mirrors the English story step for step, checks every question's choices against its answers in both languages, plays the whole story headlessly on both the honest and the thieving path in both languages, and covers hints, both endings, item branches, travel gating and save/load.

## Editing the story

The structure lives in `data/story.js`, the German texts in `data/story.de.js`. When you add, remove or reorder a step, do it in both files; the test fails until they match again. Answer keywords (`match`) are shared, so a German choice label must contain one of them (umlauts are folded: ü → ue).

Everything else lives in `data/story.js`. Each room has `steps`; an `ask` step has `choices` (the buttons shown, 2–4 options), `answers` with accepted keywords (matched case-insensitively, umlauts folded, number words understood) and `hints` that cycle on wrong answers. A choice is correct when it matches one of the answers' keywords, so keep the two in sync. Answers can grant or remove items, set a flag, retry the question, or end the game (`gameOver`, with an optional `card` text).

Any step can be conditional with `ifItem`, `unlessItem`, `ifFlag` or `unlessFlag` (a name or a list); a step whose condition fails is skipped silently. When a step both removes an item and is followed by a fallback that checks for its absence, put the fallback first. `STORY.score` names the flags counted on the end card and the rank text for each count.

## Credits

Original concept and story (2012): Darya Davydenkova, Sergej Kozuhovskij, Yasser Maslout, Peter Szmidt. Course: Mobile Text Adventure Games, Dennis Krannich and Sabrina Wilske.

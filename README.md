# Bremen City Quest

A location-based text adventure through the old town of Bremen. A ghost from the past guides you from the Sögestraße to the Schnoor; at each real-world point you answer questions about what you see and pick up items along the way.

This is a revival of *CityQuest*, a 2012 university project (Mobile Text Adventure Games, SoSe 2012) originally built in C# for Windows Phone. The story is unchanged; the app is now a dependency-free mobile web app that runs on any phone.

## Play

Open `index.html` over HTTP (geolocation requires HTTPS or `localhost`):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

To test on a phone, host the folder on any HTTPS static host (GitHub Pages works) or use a tunnel such as `ngrok`.

- Answer the ghost with keywords: `yes`, `9`, `Roland`, `take`…
- Commands: `help`, `hint`, `items`, `look`, `where`
- Progress is saved automatically in the browser.
- **Developer mode** (menu): skips the GPS check with an *I'm here* button and enables `goto <n>` to jump to any point.

## Structure

| Path | Purpose |
|------|---------|
| `data/story.js` | All rooms, coordinates, questions, accepted answers, hints and items |
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
| 8 | Schnoor | bakery |
| 9 | Schnoor | Katzen-Café (end of the beta story) |

Coordinates in `data/story.js` are approximate and the radii (35–45 m) should be tuned on site. Only the *next* point is checked, so nearby points cannot be confused.

## Editing the story

Everything lives in `data/story.js`. Each room has `steps`; an `ask` step lists accepted keywords (matched case-insensitively, umlauts folded, number words understood) and a list of hints that cycle on wrong answers. Answers can grant or remove items, retry the question, or end the game.

## Credits

Original concept and story (2012): Darya Davydenkova, Sergej Kozuhovskij, Yasser Maslout, Peter Szmidt. Course: Mobile Text Adventure Games, Dennis Krannich and Sabrina Wilske.

# Story proposal: the curse, the cat, the items, the ending

Draft for the author to mark up. Covers issues #7 (ending), #8 (ghost's goal and the thread between points) and #9 (item logic). Nothing here is in the game yet.

The 2012 route and every quiz question stay as they are. What changes is the *why*: who the ghost is, what the cat wants, why the thief takes the bell, what the items are for, and how the player gets home.

## The pitch in one paragraph

The ghost is **Hinrich**, a bell-founder's apprentice who in 1404, the year Roland and the new town hall went up, stole the small bell that was meant to call the free citizens of Bremen together. He was hanged for it. His "curse" is real but he lies about the cure: he claims the bell only has to ring again, but it has to ring *in a living hand he controls*. That is why he needs the player. The **cat** of the Stadtmusikanten is the city's guardian. It has kept the bell hidden in a mirage for six hundred years and needs an honest living person to carry it into the Schnoor and ring it there, which lays Hinrich to rest and opens the way back to the future. The **thief** is the cat's helper, a street kid called **Fiete**, who takes the bell so Hinrich cannot have it rung in the wrong place, and leads the player into the Schnoor. Along the way the cat watches whether the player steals when Hinrich says steal.

## What the player learns, and when

| Point | What the player learns | Why we go to the next point |
|---|---|---|
| 0 Prologue | Hinrich: "I am cursed to wander until the bell I lost rings again. Help me find it and the way home opens for you." (true) | "It began with pigs. I was a swineherd's boy before the foundry." |
| 1 Sögestraße | The horn enchants animals. Hinrich, too eager: "It works on more than pigs. Trust me." (foreshadowing) | A pig or the shepherd chases you. "Run to where the dead are. The old churchyard." |
| 2 Liebfrauenkirchhof | The rose window throws a light towards the Dom. | "The light points. Follow it." |
| 3 Dom | Gesche Gottfried and the Spuckstein. Hinrich gets distracted and sharp at the stone: he was executed a stone's throw from here. The player may notice. | "The Dom is a dead end. The bell is not here. Try the marketplace, where the city hangs its bells." |
| 4 Marktplatz | Roland, 1404. The shield. The Stadtmusikanten cat speaks: "The bell you seek is hidden in a mirage. Follow the bells. And watch what he makes you take." | "Böttcherstraße. Bells." |
| 5 Böttcherstraße | The Haus des Glockenspiels mirage drops a real bell. The golden relief is a second mirage. Hinrich pushes to take the gold. | The cat: Domsheide. |
| 6 Domsheide | Die Glocke. Fiete bumps into you and runs off with the bell, not the gold. Hinrich panics: "The bell! Not the gold, the bell! Run!" | Chase into the Schnoor. |
| 7 St. Johann | Hinrich is nervous near churches. "Bells. Everywhere bells. Keep moving." | Deeper into the Schnoor. |
| 8 Schnoor entrance | Klaben. If you have gold you buy it; if not, the baker gives you a piece for your story. Beck's sign: Fiete was seen heading for the cats. | "The cat. Of course. It was always the cat." |
| 9 Katzen-Café | Finale. See below. | Home. |

## Items and what they do

| Item | How you get it | What it does |
|---|---|---|
| Horn | Steal it from the shepherd (optional) | In the finale, blowing it silences Hinrich's scream. Without it, the cat does it for you, slower. It also marks you as someone who stole. |
| Bell | Catch it at the Glockenspiel mirage (required) | The MacGuffin. Fiete takes it at the Domsheide; you get it back at the end. |
| Gold | Take it at the Böttcherstraße entrance (optional, Hinrich pushes hard) | Buys the Klaben honestly at point 8. If you still carry gold at the end, the cat makes you give it back. |
| Klaben | Buy with gold, or earn as a gift from the baker | You give it to Fiete, who is hungry. He gives you the bell back. |

This answers the tester's three complaints in one stroke: the thief takes the bell because the bell is what matters; the Klaben is bought or earned, not picked off the ground; and the stealing is now the point, because the cat is watching and Hinrich is the one telling you to steal.

## The finale at the Katzen-Café (point 9)

Fiete sits with the cat and the bell. Hinrich: "Give me control! I'll fight the cat with your magic items!"

Choices:

- **Give him control.** Bad ending. Hinrich takes the body, rings the bell himself, and the player becomes the next voice without a body. Game over card: "Hello, can you hear me?" The loop is the joke.
- **Refuse.** Continues.
- **"Hanswurst!"** Keep it as an Easter egg: it also refuses, and Hinrich is offended.

After refusing, Hinrich screams. If you have the horn, you blow it and he stops; if not, the cat yowls and he stops, after a longer, nastier paragraph.

The cat explains: the bell has to ring in an honest hand, here, where the Schnoor rope-makers once rang it to warn of thieves. Fiete is hungry: give him the Klaben and he hands you the bell. If you still carry gold, the cat tells you it goes back to the Böttcherstraße, and you promise.

Then the cat tallies, quietly, how often you did what Hinrich said:

- Took neither horn nor gold: "An honest one. Rare." Best line.
- Took one: "Half a thief. Bremen can live with that."
- Took both: "Ring it anyway. Then go, before I change my mind."

You ring the bell. The mirage dissolves, Hinrich thanks you, honestly for once, and fades. You wake up on the cobbles at Schnoor 38, today, phone in hand, a bakery smell in the air. The End card shows the tally as a score, which is the 2012 report's high-score idea.

## What the engine needs

Three small additions, all backwards compatible:

- `ifItem` / `unlessItem` on a step, so a step only plays when the player carries (or lacks) an item. Needed at point 8 (buy vs gift) and in the finale (horn vs cat).
- `flag` on an answer and `ifFlag` on a step, to remember choices that are not items, such as "gave the Klaben to Fiete".
- An end card that can show a score line.

Estimated at one or two hours including tests. No change to the UI.

## Open questions for the author

1. Is "Hinrich" fine, or do you want a real historical figure or a name from the 2012 team?
2. Keep "Hanswurst!" as the Easter egg, or drop it?
3. Should the horn have a use earlier than the finale, for example scaring Fiete at St. Johann so he drops a clue?
4. The prologue currently says "middle-age city". With 1404 as the anchor, do you want the ghost to name the year?
5. Any point where the quiz question should change because the new reason for being there makes the old question odd? I think they all survive, but you know the places.

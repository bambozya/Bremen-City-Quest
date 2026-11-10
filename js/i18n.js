/* Languages. UI strings per language, plus localizeStory(), which applies a translation
 * overlay (data/story.<lang>.js) to the base story in data/story.js. The base story keeps
 * the structure, coordinates and answer keywords; an overlay only carries text. */
(function (global) {
  "use strict";

  var I18N = {
    en: {
      name: "English",
      menuSub: "a location-based text adventure",
      continueGame: "▶ Continue", newGame: "✦ New game", settings: "Settings", sound: "Sound effects",
      language: "Language", jump: "Jump to point", close: "Close",
      help: "Start in the city centre. Follow the compass to each point and answer the ghost by tapping one of the options. Tap a message to skip the typing.",
      credits: "Original concept 2012: D. Davydenkova, S. Kozuhovskij, Y. Maslout, P. Szmidt.",
      goTo: "▸ Go to", waitingGps: "Waiting for GPS…", maps: "Maps", compass: "Compass", compassOn: "Compass on", noCompass: "No compass",
      here: "I’m here", gotIt: "Got it",
      arrowNorth: "Arrow points relative to north. Enable the compass.", turnUntil: "Turn until the arrow points up.",
      useMaps: "Use Maps to navigate, or tap “I’m here” when you arrive.",
      dirs: ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"],
      distDir: "{dist} to the {dir}",
      navNoGps: "You are not there yet. Next stop: {label}. Waiting for GPS — follow the arrow or open Maps.",
      navDist: "You are not there yet. {label} is about {dist} to the {dir}. Follow the arrow.",
      youSayHere: "You say you are at: {label}",
      geo: { unsupported: "Geolocation is not supported by this browser.", denied: "Location permission denied.", unavailable: "Position unavailable.", timeout: "Location timeout." },
      theEnd: "THE END", gameOver: "GAME OVER", thanks: "Thank you for playing Bremen City Quest.", notAmused: "The ghost is not amused.",
      playAgain: "↻ Play again", tryAgain: "↻ Try again",
      tally: "{count} of {total} times you took what the ghost told you to.",
      statusEnd: "The End", showWay: "Show the way to this point",
      remarks: [
        "Boo. Just kidding.",
        "Stop poking me. I’m transparent, not intangible. Wait…",
        "I have been dead for six hundred years. I can wait. You can’t.",
        "Focus. There is a question waiting.",
        "Did you know Roland has a spare in the cellar? Neither did he.",
        "If you see the cat, don’t trust it. Or do. I’m a ghost, not your mother.",
        "Every time you poke me, a pig in the Sögestraße oinks.",
        "Yes? Do I have something on my face? I don’t have a face."
      ],
      sulking: "Enough. I’m sulking now.", catMeow: "The cat looks at you. Meow.",
      boot: ["BREMEN CITY QUEST v2.0", "loading story ........ ok", "ghost module ......... ok", "gps receiver ......... {gps}", "press any key. no wait. just read."],
      gpsOk: "ok", gpsMissing: "missing",
      resumed: "— game resumed —", langChanged: "— Language: English —",
      engine: {
        banner: "— {title} —", reached: "You have reached: {title}",
        gained: "You now carry: {item}", lost: "Lost: {item}",
        help: "Answer the ghost with a keyword (e.g. 'yes', '9', 'Roland').\nCommands: hint · items · look · where · help · goto <n>",
        noHint: "No hint this time. Think!", over: "The game is over. Start a new game from the menu.",
        unknownPoint: "Unknown point.", jumped: "Jumped to point {n}", noQuestion: "No question is pending.",
        carry: "You carry: {items}.", nothing: "You carry nothing.",
        onWay: "On the way to point {id}: {title}. {items}", atPoint: "Point {id}: {title}. {items}", where: "Point {id}: {title}{label}"
      }
    },
    de: {
      name: "Deutsch",
      menuSub: "ein ortsbasiertes Textabenteuer",
      continueGame: "▶ Weiterspielen", newGame: "✦ Neues Spiel", settings: "Einstellungen", sound: "Soundeffekte",
      language: "Sprache", jump: "Zu Punkt springen", close: "Schließen",
      help: "Starte in der Innenstadt. Folge dem Kompass zu jedem Punkt und antworte dem Geist, indem du eine der Optionen antippst. Tippe auf eine Nachricht, um das Tippen zu überspringen.",
      credits: "Originalkonzept 2012: D. Davydenkova, S. Kozuhovskij, Y. Maslout, P. Szmidt.",
      goTo: "▸ Gehe zu", waitingGps: "Warte auf GPS…", maps: "Karte", compass: "Kompass", compassOn: "Kompass an", noCompass: "Kein Kompass",
      here: "Ich bin da", gotIt: "Alles klar",
      arrowNorth: "Der Pfeil zeigt relativ zu Norden. Schalte den Kompass ein.", turnUntil: "Dreh dich, bis der Pfeil nach oben zeigt.",
      useMaps: "Navigiere mit der Karte oder tippe „Ich bin da“, wenn du angekommen bist.",
      dirs: ["Norden", "Nordosten", "Osten", "Südosten", "Süden", "Südwesten", "Westen", "Nordwesten"],
      distDir: "{dist} Richtung {dir}",
      navNoGps: "Du bist noch nicht da. Nächster Halt: {label}. Warte auf GPS – folge dem Pfeil oder öffne die Karte.",
      navDist: "Du bist noch nicht da. {label} ist etwa {dist} Richtung {dir}. Folge dem Pfeil.",
      youSayHere: "Du sagst, du bist hier: {label}",
      geo: { unsupported: "Dieser Browser unterstützt keine Ortung.", denied: "Standortfreigabe verweigert.", unavailable: "Position nicht verfügbar.", timeout: "Zeitüberschreitung bei der Ortung." },
      theEnd: "ENDE", gameOver: "GAME OVER", thanks: "Danke, dass du Bremen City Quest gespielt hast.", notAmused: "Der Geist ist nicht amüsiert.",
      playAgain: "↻ Noch einmal", tryAgain: "↻ Noch einmal versuchen",
      tally: "{count} von {total} Mal hast du genommen, was der Geist dir gesagt hat.",
      statusEnd: "Ende", showWay: "Weg zu diesem Punkt anzeigen",
      remarks: [
        "Buh. Nur Spaß.",
        "Hör auf, mich anzustupsen. Ich bin durchsichtig, nicht unberührbar. Moment…",
        "Ich bin seit sechshundert Jahren tot. Ich kann warten. Du nicht.",
        "Konzentration. Da wartet eine Frage.",
        "Wusstest du, dass Roland einen Ersatz im Keller hat? Er auch nicht.",
        "Wenn du die Katze siehst, trau ihr nicht. Oder doch. Ich bin ein Geist, nicht deine Mutter.",
        "Jedes Mal, wenn du mich anstupst, grunzt ein Schwein in der Sögestraße.",
        "Ja? Hab ich was im Gesicht? Ich habe kein Gesicht."
      ],
      sulking: "Genug. Ich schmolle jetzt.", catMeow: "Die Katze sieht dich an. Miau.",
      boot: ["BREMEN CITY QUEST v2.0", "lade geschichte ...... ok", "geist-modul .......... ok", "gps-empfänger ........ {gps}", "beliebige taste drücken. nein, warte. einfach lesen."],
      gpsOk: "ok", gpsMissing: "fehlt",
      resumed: "— Spiel fortgesetzt —", langChanged: "— Sprache: Deutsch —",
      engine: {
        banner: "— {title} —", reached: "Du hast erreicht: {title}",
        gained: "Du trägst jetzt: {item}", lost: "Verloren: {item}",
        help: "Antworte dem Geist mit einem Stichwort (z. B. ‚ja‘, ‚9‘, ‚Roland‘).\nBefehle: hint · items · look · where · help · goto <n>",
        noHint: "Diesmal kein Tipp. Denk nach!", over: "Das Spiel ist vorbei. Starte ein neues Spiel im Menü.",
        unknownPoint: "Unbekannter Punkt.", jumped: "Gesprungen zu Punkt {n}", noQuestion: "Gerade ist keine Frage offen.",
        carry: "Du trägst: {items}.", nothing: "Du trägst nichts.",
        onWay: "Unterwegs zu Punkt {id}: {title}. {items}", atPoint: "Punkt {id}: {title}. {items}", where: "Punkt {id}: {title}{label}"
      }
    }
  };

  /* Fill "{name}" placeholders. */
  function format(s, params) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return params && params[k] !== undefined ? params[k] : m;
    });
  }

  /* Deep copy of `base` with the texts of `overlay` applied and `ui` (engine strings) attached.
   * Overlay format, see data/story.de.js: rooms[i] = { title, label, steps: [ string | ask ] } where a
   * string replaces a text/ghost step's text and an ask is { ghost, choices, hints, replies?, cards? }
   * with replies/cards aligned to the base step's answers. */
  function localizeStory(base, overlay, ui) {
    var story = JSON.parse(JSON.stringify(base));
    if (ui) story.ui = ui;
    if (!overlay) return story;
    if (overlay.title) story.title = overlay.title;
    if (overlay.itemNames) story.itemNames = overlay.itemNames;
    if (overlay.score && story.score) story.score.ranks = overlay.score.ranks || story.score.ranks;
    (overlay.rooms || []).forEach(function (or, i) {
      var room = story.rooms[i];
      if (!room || !or) return;
      if (or.title) room.title = or.title;
      if (or.label && room.location) room.location.label = or.label;
      (or.steps || []).forEach(function (os, j) {
        var step = room.steps[j];
        if (!step || os === null || os === undefined) return;
        if (typeof os === "string") { step.text = os; return; }
        if (os.ghost) step.ghost = os.ghost;
        if (os.text) step.text = os.text;
        if (os.choices) step.choices = os.choices;
        if (os.hints) step.hints = os.hints;
        (os.replies || []).forEach(function (r, k) { if (r && step.answers[k]) step.answers[k].reply = r; });
        (os.cards || []).forEach(function (c, k) { if (c && step.answers[k]) step.answers[k].card = c; });
      });
    });
    return story;
  }

  global.I18N = I18N;
  global.i18nFormat = format;
  global.localizeStory = localizeStory;
})(window);

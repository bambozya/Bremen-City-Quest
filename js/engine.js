/* Game engine: state machine over STORY rooms/steps. No DOM access. */
(function (global) {
  "use strict";

  var NUMBER_WORDS = {
    one: "1", eins: "1", two: "2", zwei: "2", three: "3", drei: "3", four: "4", vier: "4",
    five: "5", fuenf: "5", six: "6", sechs: "6", seven: "7", sieben: "7", eight: "8", acht: "8",
    nine: "9", neun: "9", ten: "10", zehn: "10", twelve: "12", zwoelf: "12",
    fifteen: "15", fuenfzehn: "15", thirty: "30", dreissig: "30"
  };

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[’'`´"“”.,!?;:()\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matches(input, keyword) {
    var inp = normalize(input);
    var kw = normalize(keyword);
    if (!inp || !kw) return false;
    if (inp === kw) return true;
    // whole-word / phrase containment
    var re = new RegExp("(^| )" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "( |$)");
    if (re.test(inp)) return true;
    // number words: "nine pigs" -> "9"
    var translated = inp.split(" ").map(function (w) { return NUMBER_WORDS[w] || w; }).join(" ");
    return translated !== inp && re.test(translated);
  }

  function Engine(story, emit) {
    this.story = story;
    this.emit = emit || function () {};
    this.reset();
  }

  Engine.prototype.reset = function () {
    this.state = {
      room: 0,
      step: 0,
      arrived: false,
      items: [],
      hintIdx: {},
      wrong: 0,
      gameOver: false,
      finished: false,
      devMode: false
    };
  };

  Engine.prototype.load = function (saved) {
    if (!saved || typeof saved.room !== "number") return false;
    this.reset();
    for (var k in saved) if (Object.prototype.hasOwnProperty.call(saved, k)) this.state[k] = saved[k];
    return true;
  };

  Engine.prototype.snapshot = function () {
    return JSON.parse(JSON.stringify(this.state));
  };

  Engine.prototype.currentRoom = function () {
    return this.story.rooms[this.state.room] || null;
  };

  Engine.prototype.currentStep = function () {
    var r = this.currentRoom();
    return r ? r.steps[this.state.step] || null : null;
  };

  Engine.prototype.needsTravel = function () {
    var r = this.currentRoom();
    return !!(r && r.location && !this.state.arrived && !this.state.finished && !this.state.gameOver);
  };

  /* Start a fresh game: emits the prologue up to the first question. */
  Engine.prototype.start = function () {
    this.reset();
    this.emit({ kind: "system", text: "— " + this.story.title + " —" });
    this.state.arrived = true;
    this.run();
  };

  /* Called when the player reaches the current room (or teleports in dev mode). */
  Engine.prototype.arrive = function () {
    if (!this.needsTravel()) return;
    var r = this.currentRoom();
    this.state.arrived = true;
    this.emit({ kind: "system", text: "You have reached: " + r.title });
    this.run();
  };

  /* Runs steps until a question is pending, a travel is required, or the game ends. */
  Engine.prototype.run = function () {
    var s = this.state;
    for (;;) {
      var room = this.currentRoom();
      if (!room) { this.finish(); return; }
      if (room.location && !s.arrived) {
        this.emit({ kind: "travel", room: room });
        return;
      }
      var step = room.steps[s.step];
      if (!step) {
        // room complete -> next room
        s.room += 1;
        s.step = 0;
        s.arrived = false;
        s.wrong = 0;
        if (!this.currentRoom()) { this.finish(); return; }
        continue;
      }
      if (step.type === "text") {
        this.emit({ kind: "text", text: step.text });
        if (step.removeItem) this.removeItem(step.removeItem);
        if (step.item) this.addItem(step.item);
        s.step += 1;
        continue;
      }
      if (step.type === "ghost") {
        this.emit({ kind: "ghost", text: step.text });
        s.step += 1;
        continue;
      }
      if (step.type === "ask") {
        this.emit({ kind: "ghost", text: step.ghost, question: true });
        return; // wait for input
      }
      s.step += 1; // unknown step type: skip
    }
  };

  Engine.prototype.finish = function () {
    this.state.finished = true;
    this.emit({ kind: "system", text: "THE END — thank you for playing Bremen City Quest." });
    this.emit({ kind: "finished" });
  };

  Engine.prototype.addItem = function (name) {
    if (this.state.items.indexOf(name) === -1) {
      this.state.items.push(name);
      this.emit({ kind: "item", text: "You now carry: " + name, item: name, gained: true });
    }
  };

  Engine.prototype.removeItem = function (name) {
    var i = this.state.items.indexOf(name);
    if (i !== -1) {
      this.state.items.splice(i, 1);
      this.emit({ kind: "item", text: "Lost: " + name, item: name, gained: false });
    }
  };

  Engine.prototype.hintKey = function () {
    return this.state.room + ":" + this.state.step;
  };

  Engine.prototype.giveHint = function () {
    var step = this.currentStep();
    if (!step || step.type !== "ask") return false;
    var hints = step.hints || [];
    if (!hints.length) { this.emit({ kind: "ghost", text: "No hint this time. Think!" }); return true; }
    var key = this.hintKey();
    var idx = this.state.hintIdx[key] || 0;
    this.emit({ kind: "ghost", text: hints[idx % hints.length], hint: true });
    this.state.hintIdx[key] = idx + 1;
    return true;
  };

  /* Repeat the pending question. */
  Engine.prototype.look = function () {
    var step = this.currentStep();
    if (this.needsTravel()) {
      this.emit({ kind: "travel", room: this.currentRoom() });
    } else if (step && step.type === "ask") {
      this.emit({ kind: "ghost", text: step.ghost, question: true });
    } else {
      this.emit({ kind: "system", text: "Nothing to see here." });
    }
  };

  /* Handle a line of player input. Returns true if consumed. */
  Engine.prototype.input = function (raw) {
    var s = this.state;
    var text = String(raw || "").trim();
    if (!text) return false;
    this.emit({ kind: "player", text: text });

    if (s.gameOver || s.finished) {
      this.emit({ kind: "system", text: "The game is over. Start a new game from the menu." });
      return true;
    }

    var cmd = normalize(text);
    var parts = cmd.split(" ");

    // --- commands ---
    if (cmd === "help" || cmd === "?" || cmd === "hilfe") {
      this.emit({ kind: "system", text:
        "Answer the ghost with a keyword (e.g. 'yes', '9', 'Roland').\n" +
        "Commands: hint · items · look · where · help" + (s.devMode ? " · goto <n>" : "") });
      return true;
    }
    if (cmd === "hint" || cmd === "tipp" || cmd === "clue") { if (!this.giveHint()) this.emit({ kind: "system", text: "No question is pending." }); return true; }
    if (cmd === "items" || cmd === "inventory" || cmd === "inv" || cmd === "i") {
      this.emit({ kind: "system", text: s.items.length ? "You carry: " + s.items.join(", ") : "You carry nothing." });
      return true;
    }
    if (cmd === "look" || cmd === "l" || cmd === "repeat") { this.look(); return true; }
    if (cmd === "where" || cmd === "wo") {
      var r = this.currentRoom();
      this.emit({ kind: "system", text: "Point " + r.id + ": " + r.title + (r.location ? " — " + r.location.label : "") });
      return true;
    }
    if (parts[0] === "goto" && s.devMode) {
      var n = parseInt(parts[1], 10);
      if (isNaN(n) || !this.story.rooms[n]) { this.emit({ kind: "system", text: "Unknown point." }); return true; }
      s.room = n; s.step = 0; s.arrived = true; s.wrong = 0;
      this.emit({ kind: "system", text: "[dev] Jumped to point " + n });
      this.run();
      return true;
    }

    // --- travel gate ---
    if (this.needsTravel()) {
      this.emit({ kind: "system", text: "You are not there yet. Follow the compass to " + this.currentRoom().location.label + "." });
      return true;
    }

    // --- answer a question ---
    var step = this.currentStep();
    if (!step || step.type !== "ask") { this.run(); return true; }

    var answers = step.answers || [];
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      var hit = false;
      for (var j = 0; j < a.match.length; j++) if (matches(text, a.match[j])) { hit = true; break; }
      if (!hit) continue;

      if (a.reply) this.emit({ kind: "ghost", text: a.reply });
      if (a.gameOver) {
        s.gameOver = true;
        this.emit({ kind: "system", text: "GAME OVER. Try again?" });
        this.emit({ kind: "gameover" });
        return true;
      }
      if (a.retry) return true;
      if (a.item) this.addItem(a.item);
      if (a.removeItem) this.removeItem(a.removeItem);
      s.wrong = 0;
      s.step += 1;
      this.run();
      return true;
    }

    // wrong answer -> hint
    s.wrong += 1;
    this.giveHint();
    return true;
  };

  Engine.normalize = normalize;
  Engine.matches = matches;
  global.Engine = Engine;
})(window);

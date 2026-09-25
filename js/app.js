/* UI glue: DOM, message queue with typewriter, persistence, geolocation gating, sound. */
(function () {
  "use strict";

  var SAVE_KEY = "bcq.save.v1";
  var SOUND_KEY = "bcq.sound";
  var TYPE_MS = 14;          // ms per character, ghost lines
  var NARRATE_MS = 8;        // ms per character, narration
  var $ = function (id) { return document.getElementById(id); };

  var els = {
    log: $("log"), choices: $("choices"), gotoRow: $("gotoRow"), selGoto: $("selGoto"),
    statusRoom: $("statusRoom"), statusDev: $("statusDev"), statusItems: $("statusItems"),
    progress: $("progress"), companion: $("companion"), cat: $("cat"), menuGhost: $("menuGhost"),
    travel: $("travel"), arrow: $("arrow"), travelTarget: $("travelTarget"),
    travelDistance: $("travelDistance"), travelNote: $("travelNote"), travelMaps: $("travelMaps"),
    btnCompass: $("btnCompass"), btnTeleport: $("btnTeleport"),
    menu: $("menu"), btnMenu: $("btnMenu"), btnClose: $("btnClose"),
    btnNew: $("btnNew"), btnContinue: $("btnContinue"), chkDev: $("chkDev"), chkSound: $("chkSound")
  };

  var transcript = [];
  var stopGeo = null, lastPos = null, heading = null, pendingRoom = null;
  var lastWasHint = false;

  // ---------- sound (tiny chiptune blips, off by default) ----------
  var Sfx = (function () {
    var ctx = null, on = false;
    function ac() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); return ctx; }
    function tone(freq, dur, when, type, vol) {
      if (!on) return;
      try {
        var c = ac(), o = c.createOscillator(), g = c.createGain();
        o.type = type || "square"; o.frequency.value = freq;
        g.gain.value = vol || 0.05;
        o.connect(g); g.connect(c.destination);
        var t = c.currentTime + (when || 0);
        o.start(t); g.gain.setValueAtTime(vol || 0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.stop(t + dur);
      } catch (e) { /* audio unavailable */ }
    }
    return {
      set: function (v) { on = !!v; if (on) ac(); },
      get: function () { return on; },
      talk: function () { tone(660, 0.05); },
      ok: function () { tone(523, 0.08); tone(784, 0.12, 0.08); },
      bad: function () { tone(160, 0.18, 0, "sawtooth", 0.04); },
      item: function () { tone(523, 0.06); tone(659, 0.06, 0.06); tone(784, 0.06, 0.12); tone(1046, 0.14, 0.18); },
      arrive: function () { tone(392, 0.08); tone(523, 0.08, 0.09); tone(659, 0.16, 0.18); },
      meow: function () { tone(880, 0.08, 0, "triangle", 0.06); tone(740, 0.14, 0.08, "triangle", 0.06); }
    };
  })();

  // ---------- message queue + typewriter ----------
  var queue = [], typing = null, pumpTimer = null;

  function scrollLog() {
    requestAnimationFrame(function () { els.log.scrollTop = els.log.scrollHeight; });
  }

  /* While messages are queued or typing, choices are hidden and the pokeable sprites are disabled. */
  function setBusy(busy) {
    els.choices.classList.toggle("waiting", busy);
    els.companion.disabled = busy;
    els.cat.disabled = busy;
  }

  function enqueue(item) { queue.push(item); setBusy(true); pump(); }

  function pump() {
    if (typing || pumpTimer) return;
    if (!queue.length) { setBusy(false); scrollLog(); return; }
    render(queue.shift());
  }

  function afterRender(delay) {
    if (delay) pumpTimer = setTimeout(function () { pumpTimer = null; pump(); }, delay);
    else pump();
  }

  /* Reveal `text` inside `body` one character at a time. The full text is laid out
   * (invisible) from the start so the bubble never changes height while typing. */
  function typeInto(body, text, speed, onDone) {
    body.innerHTML = "";
    var typed = document.createElement("span"); typed.className = "typed";
    var cursor = document.createElement("span"); cursor.className = "cursor"; cursor.textContent = "▮";
    var untyped = document.createElement("span"); untyped.className = "untyped"; untyped.textContent = text;
    body.appendChild(typed); body.appendChild(cursor); body.appendChild(untyped);
    var i = 0, timer = null;
    function finish() {
      clearTimeout(timer);
      body.textContent = text;
      typing = null;
      onDone();
    }
    (function step() {
      if (i >= text.length) { finish(); return; }
      var ch = text[i++];
      typed.textContent += ch;
      untyped.textContent = text.slice(i);
      var d = speed;
      if (ch === "." || ch === "!" || ch === "?") d = 220; else if (ch === ",") d = 90; else if (ch === "\n") d = 160;
      timer = setTimeout(step, d);
    })();
    typing = { finish: finish };
  }

  function makeRow(kind, avatarSprite) {
    var row = document.createElement("div");
    row.className = "row row-" + kind;
    row.appendChild(Pixel.el(avatarSprite, 30, "avatar"));
    return row;
  }

  function render(it) {
    var kind = it.kind;

    if (kind === "ghost") {
      var row = makeRow("ghost", it.hint ? "ghostAngry" : "ghost");
      var bubble = document.createElement("div");
      bubble.className = "msg msg-ghost pxbox" + (it.hint ? " msg-hint" : "");
      row.appendChild(bubble);
      els.log.appendChild(row);
      scrollLog();
      function fill(instant) {
        bubble.innerHTML = "";
        var tag = document.createElement("span"); tag.className = "tag"; tag.textContent = it.hint ? "GHOST · HINT" : "GHOST";
        var body = document.createElement("span"); body.className = "body";
        bubble.appendChild(tag); bubble.appendChild(body);
        if (instant) { body.textContent = it.text; scrollLog(); afterRender(0); return; }
        Sfx.talk();
        typeInto(body, it.text, TYPE_MS, function () { afterRender(140); });
        scrollLog();
      }
      if (it.instant) { fill(true); return; }
      // typing indicator first (#12)
      bubble.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
      var dotsTimer = setTimeout(function () { fill(false); }, 550);
      typing = { finish: function () { clearTimeout(dotsTimer); typing = null; fill(true); } };
      return;
    }

    if (kind === "player") {
      var prow = makeRow("player", "player");
      var pb = document.createElement("div"); pb.className = "msg msg-player pxbox"; pb.textContent = it.text;
      prow.appendChild(pb);
      els.log.appendChild(prow);
      scrollLog();
      afterRender(0);
      return;
    }

    if (kind === "item") {
      var ib = document.createElement("div");
      ib.className = "msg msg-item pxbox" + (it.gained === false ? " lost" : "");
      if (it.item && Pixel.has(it.item)) ib.appendChild(Pixel.el(it.item, 28));
      var it2 = document.createElement("span"); it2.textContent = it.text; ib.appendChild(it2);
      els.log.appendChild(ib);
      scrollLog();
      if (!it.instant) Sfx.item();
      afterRender(it.instant ? 0 : 300);
      return;
    }

    if (kind === "end") {
      var card = document.createElement("div");
      card.className = "msg msg-end pxbox" + (it.win ? " win" : "");
      var t = document.createElement("div"); t.className = "end-title"; t.textContent = it.win ? "THE END" : "GAME OVER";
      var sub = document.createElement("div"); sub.className = "end-sub";
      sub.textContent = it.win ? "Thank you for playing Bremen City Quest." : "The ghost is not amused.";
      var btn = document.createElement("button"); btn.type = "button"; btn.className = "btn btn-primary";
      btn.textContent = it.win ? "▶ Play again" : "▶ Try again";
      btn.addEventListener("click", newGame);
      card.appendChild(t); card.appendChild(sub); card.appendChild(btn);
      els.log.appendChild(card);
      scrollLog();
      afterRender(0);
      return;
    }

    if (kind === "text" && !it.instant) {
      var nd = document.createElement("div");
      nd.className = "msg msg-text";
      els.log.appendChild(nd);
      scrollLog();
      typeInto(nd, it.text, NARRATE_MS, function () { afterRender(Math.min(1800, 500 + it.text.length * 6)); });
      return;
    }

    var div = document.createElement("div");
    div.className = "msg msg-" + kind;
    div.textContent = it.text;
    els.log.appendChild(div);
    scrollLog();
    afterRender(it.instant ? 0 : (it.delay || 120));
  }

  /* Finish anything typing and render the rest immediately. */
  function flush() {
    if (pumpTimer) { clearTimeout(pumpTimer); pumpTimer = null; }
    if (typing) typing.finish();
    while (queue.length) {
      var it = queue.shift(); it.instant = true; render(it);
      if (pumpTimer) { clearTimeout(pumpTimer); pumpTimer = null; }
    }
  }

  // ---------- navigation help (#2, #3) ----------
  function compassName(b) {
    var names = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
    return names[Math.round(b / 45) % 8];
  }

  function navText(room) {
    var loc = room.location;
    if (!lastPos) return "You are not there yet. Next stop: " + loc.label + ". Waiting for GPS — follow the arrow or open Maps.";
    var d = Geo.distance(lastPos, loc), b = Geo.bearing(lastPos, loc);
    return "You are not there yet. " + loc.label + " is about " + Geo.formatDistance(d) + " to the " + compassName(b) + ". Follow the arrow.";
  }

  // ---------- companion + cat (#13, #15) ----------
  var REMARKS = [
    "Boo. Just kidding.",
    "Stop poking me. I’m transparent, not intangible. Wait…",
    "I have been dead for six hundred years. I can wait. You can’t.",
    "Focus. There is a question waiting.",
    "Did you know Roland has a spare in the cellar? Neither did he.",
    "If you see the cat, don’t trust it. Or do. I’m a ghost, not your mother.",
    "Every time you poke me, a pig in the Sögestraße oinks.",
    "Yes? Do I have something on my face? I don’t have a face."
  ];
  var pokes = 0;
  els.companion.addEventListener("click", function () {
    if (typing || queue.length || pumpTimer) return; // no poking while the ghost is talking
    pokes++;
    var text;
    if (pokes % 5 === 0) text = "Enough. I’m sulking now.";
    else text = REMARKS[Math.floor(Math.random() * REMARKS.length)];
    setMood(pokes % 5 === 0 ? "angry" : "happy");
    enqueue({ kind: "ghost", text: text });
  });

  els.cat.addEventListener("click", function () {
    if (typing || queue.length || pumpTimer) return;
    Sfx.meow();
    els.cat.classList.remove("happy"); void els.cat.offsetWidth; els.cat.classList.add("happy");
    enqueue({ kind: "text", text: "The cat looks at you. Meow." });
  });

  // ---------- status ----------
  function setMood(mood) {
    els.companion.innerHTML = Pixel.svg(mood === "happy" ? "ghostHappy" : mood === "angry" ? "ghostAngry" : "ghost", 36);
    els.companion.className = "companion" + (mood ? " " + mood : "");
    if (mood) setTimeout(function () { if (els.companion.classList.contains(mood)) setMood(""); }, 1600);
  }

  function renderChoices() {
    els.choices.innerHTML = "";
    var choices = engine.pendingChoices();
    choices.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice" + (c.tried ? " tried" : "") + (choices.length === 1 ? " single" : "");
      b.textContent = c.label;
      if (c.tried) { b.disabled = true; b.setAttribute("aria-label", c.label + " (already tried)"); }
      else b.addEventListener("click", function () { say(c.label); });
      els.choices.appendChild(b);
    });
  }

  function renderStatus() {
    var r = engine.currentRoom();
    var s = engine.state;
    els.statusRoom.textContent = s.finished ? "The End" : r ? r.title : "—";
    els.statusDev.classList.toggle("hidden", !s.devMode);
    els.btnTeleport.classList.toggle("hidden", !s.devMode);
    var html = "";
    for (var i = 1; i < STORY.rooms.length; i++) {
      var cls = i < s.room || s.finished ? "done" : i === s.room ? "now" : "";
      html += '<i class="' + cls + '"></i>';
    }
    els.progress.innerHTML = html;
    els.statusItems.innerHTML = "";
    s.items.forEach(function (name) {
      if (Pixel.has(name)) { var e = Pixel.el(name, 22); e.title = name; els.statusItems.appendChild(e); }
    });
    // the cat joins after the Marktplatz (#15)
    var catAround = s.room >= 5 && !s.gameOver;
    els.cat.classList.toggle("hidden", !catAround);
    if (catAround && !els.cat.innerHTML) els.cat.innerHTML = Pixel.svg("cat", 36);
    renderChoices();
  }

  // ---------- travel ----------
  function showTravel(room) {
    pendingRoom = room;
    els.travel.classList.remove("hidden");
    els.travelTarget.textContent = room.location.label;
    els.travelMaps.href = Geo.mapsUrl(room.location);
    els.travelDistance.textContent = "Waiting for GPS…";
    els.travelNote.textContent = "";
    startGeo();
    updateTravel();
    scrollLog();
  }

  function hideTravel() {
    pendingRoom = null;
    els.travel.classList.add("hidden");
    scrollLog();
  }

  function updateTravel() {
    if (!pendingRoom || !lastPos) return;
    var loc = pendingRoom.location;
    var d = Geo.distance(lastPos, loc);
    var b = Geo.bearing(lastPos, loc);
    els.travelDistance.textContent = Geo.formatDistance(d) + " to the " + compassName(b) +
      (lastPos.accuracy ? " (±" + Math.round(lastPos.accuracy) + " m)" : "");
    var rot = heading === null ? b : (b - heading);
    els.arrow.style.transform = "rotate(" + rot + "deg)";
    els.travelNote.textContent = heading === null
      ? "Arrow points relative to north. Enable the compass."
      : "Turn until the arrow points up.";
    var slack = Math.min(lastPos.accuracy || 0, 25);
    if (d <= loc.radius + slack) arrive();
  }

  function arrive() {
    hideTravel();
    Sfx.arrive();
    setMood("happy");
    engine.arrive();
    persist();
  }

  function startGeo() {
    if (stopGeo) return;
    stopGeo = Geo.watch(function (pos) { lastPos = pos; updateTravel(); }, function (msg) {
      els.travelDistance.textContent = msg;
      els.travelNote.textContent = "Use Maps to navigate, or enable developer mode.";
    });
  }

  els.btnCompass.addEventListener("click", function () {
    Geo.watchHeading(function (h) { heading = h; updateTravel(); }).then(function (ok) {
      els.btnCompass.textContent = ok ? "Compass on" : "No compass";
      els.btnCompass.disabled = true;
    });
  });

  els.btnTeleport.addEventListener("click", function () {
    if (!pendingRoom) return;
    enqueue({ kind: "system", text: "[dev] teleported to " + pendingRoom.location.label, instant: true });
    arrive();
  });

  // ---------- engine ----------
  function onEmit(ev) {
    switch (ev.kind) {
      case "ghost":
        lastWasHint = !!ev.hint;
        enqueue({ kind: "ghost", text: ev.text, hint: !!ev.hint });
        transcript.push({ kind: "ghost", text: ev.text, hint: !!ev.hint });
        break;
      case "item":
        enqueue({ kind: "item", text: ev.text, item: ev.item, gained: ev.gained });
        transcript.push({ kind: "item", text: ev.text, item: ev.item, gained: ev.gained });
        break;
      case "text":
      case "player":
      case "system":
        enqueue({ kind: ev.kind, text: ev.text });
        transcript.push({ kind: ev.kind, text: ev.text });
        break;
      case "navhint":
        enqueue({ kind: "system", text: navText(ev.room) });
        break;
      case "travel":
        showTravel(ev.room);
        break;
      case "gameover":
        hideTravel();
        enqueue({ kind: "end", win: false }); // shows after the ghost finished talking (#1)
        break;
      case "finished":
        hideTravel();
        enqueue({ kind: "end", win: true });
        break;
    }
    renderStatus();
  }

  var engine = new Engine(window.STORY, onEmit);

  // ---------- persistence ----------
  function persist() {
    try {
      if (transcript.length > 300) transcript = transcript.slice(-300);
      localStorage.setItem(SAVE_KEY, JSON.stringify({ state: engine.snapshot(), transcript: transcript }));
    } catch (e) { /* no storage */ }
  }
  function loadSave() { try { var raw = localStorage.getItem(SAVE_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } }

  // ---------- menu ----------
  function openMenu() {
    var save = loadSave();
    var resumable = save && save.state && !save.state.finished && !save.state.gameOver;
    els.btnContinue.classList.toggle("hidden", !resumable);
    els.chkDev.checked = !!engine.state.devMode;
    els.gotoRow.classList.toggle("hidden", !engine.state.devMode);
    els.selGoto.value = engine.state.room;
    els.chkSound.checked = Sfx.get();
    els.menu.classList.remove("hidden");
  }
  function closeMenu() { els.menu.classList.add("hidden"); }

  els.btnMenu.addEventListener("click", openMenu);
  els.btnClose.addEventListener("click", closeMenu);
  els.chkDev.addEventListener("change", function () { engine.state.devMode = els.chkDev.checked; els.gotoRow.classList.toggle("hidden", !els.chkDev.checked); renderStatus(); persist(); });
  els.chkSound.addEventListener("change", function () {
    Sfx.set(els.chkSound.checked);
    try { localStorage.setItem(SOUND_KEY, els.chkSound.checked ? "1" : "0"); } catch (e) { /* ignore */ }
    if (els.chkSound.checked) Sfx.ok();
  });

  function boot() {
    var lines = [
      "BREMEN CITY QUEST v2.0",
      "loading story ........ ok",
      "ghost module ......... ok",
      "gps receiver ......... " + (navigator.geolocation ? "ok" : "missing"),
      "press any key. no wait. just read."
    ];
    lines.forEach(function (l, i) { enqueue({ kind: "system", text: l, delay: i === lines.length - 1 ? 900 : 300 }); });
  }

  function newGame() {
    var dev = els.chkDev.checked || engine.state.devMode;
    flush();
    els.log.innerHTML = "";
    transcript = [];
    pokes = 0;
    hideTravel();
    clearSave();
    boot();
    engine.start();
    engine.state.devMode = dev;
    renderStatus();
    persist();
    closeMenu();
  }

  els.btnNew.addEventListener("click", newGame);

  els.btnContinue.addEventListener("click", function () {
    var save = loadSave();
    if (!save) return;
    flush();
    els.log.innerHTML = "";
    transcript = save.transcript || [];
    els.log.classList.add("restoring");
    transcript.forEach(function (m) { render({ kind: m.kind, text: m.text, hint: m.hint, item: m.item, gained: m.gained, instant: true }); });
    els.log.classList.remove("restoring");
    engine.load(save.state);
    enqueue({ kind: "system", text: "— game resumed —", instant: true });
    if (engine.needsTravel()) showTravel(engine.currentRoom());
    renderStatus();
    closeMenu();
    pump();
  });

  // ---------- input ----------
  function feedback(cls) {
    els.choices.classList.remove("ok", "bad");
    void els.choices.offsetWidth;
    els.choices.classList.add(cls);
    setTimeout(function () { els.choices.classList.remove(cls); }, 700);
  }

  function say(text) {
    if (!text) return;
    flush();
    var before = engine.state.room + ":" + engine.state.step;
    var itemsBefore = engine.state.items.length;
    lastWasHint = false;
    engine.input(text);
    var s = engine.state;
    var after = s.room + ":" + s.step;
    var isCommand = /^goto( .*)?$/i.test(text.trim());
    if (pendingRoom && !engine.needsTravel()) hideTravel(); // e.g. after goto
    if (s.gameOver) { setMood("angry"); Sfx.bad(); }
    else if (!isCommand && (after !== before || s.finished || s.items.length !== itemsBefore)) { feedback("ok"); setMood("happy"); Sfx.ok(); }
    else if (!isCommand && lastWasHint) { feedback("bad"); setMood("angry"); Sfx.bad(); }
    persist();
    renderStatus();
  }

  els.log.addEventListener("click", function () { if (typing) typing.finish(); });

  // dev: jump to a point from the menu
  STORY.rooms.forEach(function (r) {
    var o = document.createElement("option"); o.value = r.id; o.textContent = r.id + " · " + r.title; els.selGoto.appendChild(o);
  });
  els.selGoto.addEventListener("change", function () {
    if (!engine.state.devMode) return;
    closeMenu();
    say("goto " + els.selGoto.value);
  });

  // ---------- boot ----------
  try { Sfx.set(localStorage.getItem(SOUND_KEY) === "1"); } catch (e) { /* ignore */ }
  els.menuGhost.innerHTML = Pixel.svg("ghost", 40);
  els.arrow.innerHTML = Pixel.svg("arrow", 48);
  setMood("");
  var save = loadSave();
  if (save && save.state) engine.state.devMode = !!save.state.devMode;
  renderStatus();
  openMenu();
})();

/* UI glue: DOM, message queue with typewriter, persistence, geolocation gating, sound. */
(function () {
  "use strict";

  var SAVE_KEY = "bcq.save.v1";
  var SOUND_KEY = "bcq.sound";
  var TYPE_MS = 14;            // ms per character for ghost lines
  var $ = function (id) { return document.getElementById(id); };

  var els = {
    log: $("log"), form: $("form"), input: $("input"), inputRow: document.querySelector(".input-row"),
    statusRoom: $("statusRoom"), statusDev: $("statusDev"), statusItems: $("statusItems"),
    progress: $("progress"), companion: $("companion"), menuGhost: $("menuGhost"),
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
      arrive: function () { tone(392, 0.08); tone(523, 0.08, 0.09); tone(659, 0.16, 0.18); }
    };
  })();

  // ---------- message queue + typewriter ----------
  var queue = [], typing = null, pumpTimer = null;

  function scrollLog() {
    requestAnimationFrame(function () { els.log.scrollTop = els.log.scrollHeight; });
  }

  function enqueue(item) { queue.push(item); pump(); }

  function pump() {
    if (typing || pumpTimer || !queue.length) return;
    var it = queue.shift();
    render(it);
  }

  function afterRender(delay) {
    if (delay) {
      pumpTimer = setTimeout(function () { pumpTimer = null; pump(); }, delay);
    } else {
      pump();
    }
  }

  function render(it) {
    var kind = it.kind;
    if (kind === "ghost") {
      var row = document.createElement("div");
      row.className = "row row-ghost";
      row.appendChild(Pixel.el(it.hint ? "ghostAngry" : "ghost", 30, "avatar"));
      var bubble = document.createElement("div");
      bubble.className = "msg msg-ghost pxbox" + (it.hint ? " msg-hint" : "");
      var tag = document.createElement("span"); tag.className = "tag"; tag.textContent = it.hint ? "GHOST · HINT" : "GHOST";
      var body = document.createElement("span"); body.className = "body";
      bubble.appendChild(tag); bubble.appendChild(body);
      row.appendChild(bubble);
      els.log.appendChild(row);
      scrollLog();
      if (it.instant) { body.textContent = it.text; afterRender(0); return; }
      Sfx.talk();
      bubble.classList.add("typing");
      var i = 0, text = it.text;
      typing = {
        finish: function () {
          clearTimeout(typing.timer);
          body.textContent = text;
          bubble.classList.remove("typing");
          typing = null;
          scrollLog();
          afterRender(120);
        }
      };
      (function step() {
        if (i >= text.length) { typing.finish(); return; }
        var ch = text[i++];
        body.textContent += ch;
        if (i % 8 === 0) scrollLog();
        var d = TYPE_MS;
        if (ch === "." || ch === "!" || ch === "?") d = 220; else if (ch === "," ) d = 90; else if (ch === "\n") d = 160;
        typing.timer = setTimeout(step, d);
      })();
      bubble.addEventListener("click", function () { if (typing) typing.finish(); });
      return;
    }

    if (kind === "player") {
      var prow = document.createElement("div");
      prow.className = "row row-player";
      prow.appendChild(Pixel.el("player", 30, "avatar"));
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
      afterRender(it.instant ? 0 : 250);
      return;
    }

    var div = document.createElement("div");
    div.className = "msg msg-" + kind;
    div.textContent = it.text;
    els.log.appendChild(div);
    scrollLog();
    afterRender(it.instant ? 0 : (it.delay || (kind === "text" ? 350 : 120)));
  }

  /* Finish anything typing and render the rest immediately. */
  function flush() {
    if (pumpTimer) { clearTimeout(pumpTimer); pumpTimer = null; }
    if (typing) typing.finish();
    while (queue.length) { var it = queue.shift(); it.instant = true; render(it); if (pumpTimer) { clearTimeout(pumpTimer); pumpTimer = null; } }
  }

  // ---------- status ----------
  function setMood(mood) {
    els.companion.innerHTML = Pixel.svg(mood === "happy" ? "ghostHappy" : mood === "angry" ? "ghostAngry" : "ghost", 36);
    els.companion.className = "companion" + (mood ? " " + mood : "");
    if (mood) setTimeout(function () { if (els.companion.classList.contains(mood)) setMood(""); }, 1600);
  }

  function renderStatus() {
    var r = engine.currentRoom();
    var s = engine.state;
    els.statusRoom.textContent = r ? "PT " + r.id + " · " + r.title.toUpperCase() : "—";
    els.statusDev.classList.toggle("hidden", !s.devMode);
    els.btnTeleport.classList.toggle("hidden", !s.devMode);
    // progress: rooms 1..9
    var html = "";
    for (var i = 1; i < STORY.rooms.length; i++) {
      var cls = i < s.room || s.finished ? "done" : i === s.room ? "now" : "";
      html += '<i class="' + cls + '"></i>';
    }
    els.progress.innerHTML = html;
    // items as sprites
    els.statusItems.innerHTML = "";
    s.items.forEach(function (name) {
      if (Pixel.has(name)) { var e = Pixel.el(name, 22); e.title = name; els.statusItems.appendChild(e); }
    });
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
    els.travelDistance.textContent = Geo.formatDistance(d) + " away" +
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
      case "travel":
        showTravel(ev.room);
        break;
      case "gameover":
      case "finished":
        hideTravel();
        setTimeout(function () { openMenu(); }, 2500);
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
    els.chkSound.checked = Sfx.get();
    els.menu.classList.remove("hidden");
  }
  function closeMenu() { els.menu.classList.add("hidden"); }

  els.btnMenu.addEventListener("click", openMenu);
  els.btnClose.addEventListener("click", closeMenu);
  els.chkDev.addEventListener("change", function () { engine.state.devMode = els.chkDev.checked; renderStatus(); persist(); });
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
    lines.forEach(function (l, i) { enqueue({ kind: "system", text: l, delay: i === lines.length - 1 ? 700 : 260 }); });
  }

  els.btnNew.addEventListener("click", function () {
    var dev = els.chkDev.checked;
    flush();
    els.log.innerHTML = "";
    transcript = [];
    hideTravel();
    clearSave();
    boot();
    engine.start();
    engine.state.devMode = dev;
    renderStatus();
    persist();
    closeMenu();
    els.input.focus();
  });

  els.btnContinue.addEventListener("click", function () {
    var save = loadSave();
    if (!save) return;
    flush();
    els.log.innerHTML = "";
    transcript = save.transcript || [];
    transcript.forEach(function (m) { render({ kind: m.kind, text: m.text, hint: m.hint, item: m.item, gained: m.gained, instant: true }); });
    engine.load(save.state);
    enqueue({ kind: "system", text: "— game resumed —", instant: true });
    if (engine.needsTravel()) showTravel(engine.currentRoom());
    renderStatus();
    closeMenu();
    els.input.focus();
  });

  // ---------- input ----------
  function feedback(cls) {
    els.inputRow.classList.remove("ok", "bad");
    void els.inputRow.offsetWidth; // restart animation
    els.inputRow.classList.add(cls);
    setTimeout(function () { els.inputRow.classList.remove(cls); }, 700);
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
    var isCommand = /^(help|\?|hilfe|hint|tipp|clue|items|inventory|inv|i|look|l|repeat|where|wo|goto( .*)?)$/i.test(text.trim());
    if (s.gameOver) { setMood("angry"); Sfx.bad(); }
    else if (!isCommand && (after !== before || s.finished || s.items.length !== itemsBefore)) { feedback("ok"); setMood("happy"); Sfx.ok(); }
    else if (!isCommand && lastWasHint) { feedback("bad"); setMood("angry"); Sfx.bad(); }
    persist();
    els.input.value = "";
  }

  els.form.addEventListener("submit", function (e) { e.preventDefault(); say(els.input.value.trim()); });
  Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (chip) {
    chip.addEventListener("click", function () { say(chip.getAttribute("data-say")); els.input.focus(); });
  });
  els.log.addEventListener("click", function () { if (typing) typing.finish(); });

  // ---------- boot ----------
  try { Sfx.set(localStorage.getItem(SOUND_KEY) === "1"); } catch (e) { /* ignore */ }
  els.menuGhost.innerHTML = Pixel.svg("ghost", 40);
  setMood("");
  var save = loadSave();
  if (save && save.state) engine.state.devMode = !!save.state.devMode;
  renderStatus();
  openMenu();
})();

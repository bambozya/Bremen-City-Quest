/* UI glue: DOM, persistence, geolocation gating. */
(function () {
  "use strict";

  var SAVE_KEY = "bcq.save.v1";
  var $ = function (id) { return document.getElementById(id); };

  var els = {
    log: $("log"), form: $("form"), input: $("input"),
    statusRoom: $("statusRoom"), statusDev: $("statusDev"), statusItems: $("statusItems"),
    travel: $("travel"), arrow: $("arrow"), travelTarget: $("travelTarget"),
    travelDistance: $("travelDistance"), travelNote: $("travelNote"), travelMaps: $("travelMaps"),
    btnCompass: $("btnCompass"), btnTeleport: $("btnTeleport"),
    menu: $("menu"), btnMenu: $("btnMenu"), btnClose: $("btnClose"),
    btnNew: $("btnNew"), btnContinue: $("btnContinue"), chkDev: $("chkDev")
  };

  var transcript = [];       // [{kind,text}] for restoring the screen
  var stopGeo = null;
  var lastPos = null;
  var heading = null;
  var pendingRoom = null;

  // ---------- rendering ----------
  function append(kind, text, extraClass) {
    var div = document.createElement("div");
    div.className = "msg msg-" + kind + (extraClass ? " " + extraClass : "");
    div.textContent = text;
    els.log.appendChild(div);
    scrollLog();
  }

  function scrollLog() {
    requestAnimationFrame(function () { els.log.scrollTop = els.log.scrollHeight; });
  }

  function renderStatus() {
    var r = engine.currentRoom();
    els.statusRoom.textContent = r ? "Point " + r.id + " · " + r.title : "—";
    els.statusDev.classList.toggle("hidden", !engine.state.devMode);
    els.statusItems.textContent = engine.state.items.length ? "🎒 " + engine.state.items.join(", ") : "";
    els.btnTeleport.classList.toggle("hidden", !engine.state.devMode);
  }

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
    els.arrow.style.transform = "rotate(" + (rot - 90) + "deg)";
    els.travelNote.textContent = heading === null
      ? "Arrow is relative to north. Enable the compass to point the way."
      : "Turn until the arrow points up.";
    // arrival: inside the radius, with a little slack for GPS noise
    var slack = Math.min(lastPos.accuracy || 0, 25);
    if (d <= loc.radius + slack) {
      hideTravel();
      engine.arrive();
      persist();
    }
  }

  // ---------- geolocation ----------
  function startGeo() {
    if (stopGeo) return;
    stopGeo = Geo.watch(function (pos) {
      lastPos = pos;
      updateTravel();
    }, function (msg) {
      els.travelDistance.textContent = msg;
      els.travelNote.textContent = "Use ‘Open in Maps’ to navigate, or enable developer mode.";
    });
  }

  els.btnCompass.addEventListener("click", function () {
    Geo.watchHeading(function (h) { heading = h; updateTravel(); }).then(function (ok) {
      els.btnCompass.textContent = ok ? "Compass on" : "Compass unavailable";
      els.btnCompass.disabled = true;
    });
  });

  els.btnTeleport.addEventListener("click", function () {
    if (!pendingRoom) return;
    append("system", "[dev] Teleported to " + pendingRoom.location.label);
    hideTravel();
    engine.arrive();
    persist();
  });

  // ---------- engine ----------
  function onEmit(ev) {
    switch (ev.kind) {
      case "ghost":
        append("ghost", ev.text, ev.hint ? "msg-hint" : "");
        transcript.push({ kind: "ghost", text: ev.text, hint: !!ev.hint });
        break;
      case "text":
      case "player":
      case "system":
      case "item":
        append(ev.kind, ev.text);
        transcript.push({ kind: ev.kind, text: ev.text });
        break;
      case "travel":
        showTravel(ev.room);
        break;
      case "gameover":
      case "finished":
        hideTravel();
        setTimeout(function () { openMenu(); }, 800);
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
    } catch (e) { /* storage unavailable: play without saving */ }
  }

  function loadSave() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  }

  // ---------- menu ----------
  function openMenu() {
    var save = loadSave();
    var resumable = save && save.state && !save.state.finished && !save.state.gameOver;
    els.btnContinue.classList.toggle("hidden", !resumable);
    els.chkDev.checked = !!engine.state.devMode;
    els.menu.classList.remove("hidden");
  }
  function closeMenu() { els.menu.classList.add("hidden"); }

  els.btnMenu.addEventListener("click", openMenu);
  els.btnClose.addEventListener("click", closeMenu);

  els.chkDev.addEventListener("change", function () {
    engine.state.devMode = els.chkDev.checked;
    renderStatus();
    persist();
  });

  els.btnNew.addEventListener("click", function () {
    var dev = els.chkDev.checked;
    els.log.innerHTML = "";
    transcript = [];
    hideTravel();
    clearSave();
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
    els.log.innerHTML = "";
    transcript = save.transcript || [];
    transcript.forEach(function (m) { append(m.kind, m.text, m.hint ? "msg-hint" : ""); });
    engine.load(save.state);
    append("system", "— game resumed —");
    if (engine.needsTravel()) showTravel(engine.currentRoom());
    renderStatus();
    closeMenu();
    els.input.focus();
  });

  // ---------- input ----------
  function say(text) {
    if (!text) return;
    engine.input(text);
    persist();
    els.input.value = "";
  }

  els.form.addEventListener("submit", function (e) {
    e.preventDefault();
    say(els.input.value.trim());
  });

  Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (chip) {
    chip.addEventListener("click", function () { say(chip.getAttribute("data-say")); els.input.focus(); });
  });

  // ---------- boot ----------
  var save = loadSave();
  if (save && save.state) engine.state.devMode = !!save.state.devMode;
  renderStatus();
  openMenu();
})();

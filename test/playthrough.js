/* Headless checks for the story and engine. Run: node test/playthrough.js */
"use strict";
global.window = global;
require("../data/story.js");
require("../js/engine.js");

var failures = 0;
function assert(c, msg) { if (!c) { failures++; console.error("FAIL:", msg); } }

// 1. Every question has 2-4 choices, exactly one of which advances (branches may have more).
STORY.rooms.forEach(function (r) {
  r.steps.forEach(function (st, i) {
    if (st.type !== "ask") return;
    var id = r.id + ":" + i;
    assert(st.choices && st.choices.length >= 2 && st.choices.length <= 4, id + " needs 2-4 choices");
    var hits = (st.choices || []).map(function (c) {
      var matched = st.answers.filter(function (a) { return a.match.some(function (k) { return Engine.matches(c, k); }); });
      assert(matched.length <= 1, id + ' choice "' + c + '" matches ' + matched.length + " answers");
      return matched.some(function (a) { return !a.retry && !a.gameOver; });
    });
    var advancing = hits.filter(Boolean).length;
    var branching = st.answers.filter(function (a) { return !a.retry && !a.gameOver; }).length;
    assert(advancing === branching, id + " has " + advancing + " advancing choices, expected " + branching);
  });
});

// 2. Full playthroughs. `thief` picks every item-granting choice, `honest` avoids them.
function play(thief) {
  var out = [];
  var engine = new Engine(STORY, function (ev) { out.push(ev); });
  engine.start();
  var guard = 0;
  while (!engine.state.finished && guard++ < 500) {
    if (engine.needsTravel()) { engine.arrive(); continue; }
    var step = engine.currentStep();
    if (!step || step.type !== "ask") { engine.run(); continue; }
    var advancing = function (a) { return !a.retry && !a.gameOver; };
    var pick = step.choices.filter(function (c) {
      return step.answers.some(function (a) { return advancing(a) && a.match.some(function (k) { return Engine.matches(c, k); }); });
    });
    var withItem = pick.filter(function (c) { return step.answers.some(function (a) { return a.item && a.match.some(function (k) { return Engine.matches(c, k); }); }); });
    var without = pick.filter(function (c) { return withItem.indexOf(c) === -1; });
    var choice = thief ? (withItem[0] || pick[0]) : (without[0] || pick[0]);
    engine.input(choice);
  }
  return { engine: engine, out: out, texts: out.map(function (e) { return e.text || ""; }).join("\n") };
}

var thief = play(true), engine = thief.engine, out = thief.out;
assert(engine.state.finished, "thief playthrough reaches the end (stopped at room " + engine.state.room + ")");
assert(engine.state.items.join() === "Horn,Bell", "thief final items: " + engine.state.items.join());
assert(!out.some(function (e) { return e.kind === "ghost" && e.hint; }), "no hints during a perfect run");
assert(engine.state.flags.stoleHorn && engine.state.flags.tookGold && !engine.state.flags.hanswurst, "thief flags set");
var fin = out[out.length - 1];
assert(fin.kind === "finished" && fin.score && fin.score.count === 2 && fin.score.total === 2, "thief score 2/2: " + JSON.stringify(fin.score));
assert(/bites it, frowns/.test(thief.texts) && !/no money of any century/.test(thief.texts), "with gold the Klaben is bought");
assert(/cats appear/.test(thief.texts) && /door slammed/.test(thief.texts), "horn is used at St. Johann and in the finale");
assert(/Horn and gold\./.test(thief.texts) && !/An honest one/.test(thief.texts), "tally for both thefts only");

var honest = play(false);
assert(honest.engine.state.finished, "honest playthrough reaches the end");
assert(honest.engine.state.items.join() === "Bell", "honest final items: " + honest.engine.state.items.join());
var hfin = honest.out[honest.out.length - 1];
assert(hfin.score && hfin.score.count === 0 && hfin.score.rank === "An honest one. Rare.", "honest score 0/2: " + JSON.stringify(hfin.score));
assert(/no money of any century/.test(honest.texts) && !/bites it, frowns/.test(honest.texts), "without gold the Klaben is a gift");
assert(/the slow way/.test(honest.texts) && /cat yowls/.test(honest.texts) && !/door slammed/.test(honest.texts), "no horn: slow search and the cat stops the scream");
assert(/An honest one/.test(honest.texts) && !/Half a thief/.test(honest.texts), "tally for no thefts only");

// 3. Wrong answer -> hint + tried; retry answer stays; refusing the ghost ends the game; nav help while travelling.
var e2 = new Engine(STORY, function (ev) { out.push(ev); });
e2.start(); e2.input("no");
assert(e2.pendingChoices().every(function (c) { return !c.tried; }), "a retry answer is not marked as tried");
e2.input("yes"); e2.input("no");
assert(e2.state.gameOver, "refusing the ghost is game over");

var e3 = new Engine(STORY, function (ev) { out.push(ev); });
e3.start(); e3.input("yes"); e3.input("yes");
assert(e3.needsTravel() && e3.pendingChoices().length === 0, "no choices while travelling");
var n = out.length; e3.input("hint");
assert(out.slice(n).every(function (e) { return e.kind !== "ghost"; }) && out[out.length - 1].kind === "navhint", "hint while travelling gives navhint only");
e3.arrive(); e3.input("yes"); e3.input("7");
assert(out[out.length - 1].hint === true, "wrong choice gives a hint");
assert(e3.pendingChoices().filter(function (c) { return c.tried; }).map(function (c) { return c.label; }).join() === "7", "wrong choice is marked tried");
var snap = e3.snapshot(); var e4 = new Engine(STORY, function () {});
assert(e4.load(snap) && e4.pendingChoices()[0].tried, "tried state survives save/load");

// 4. Finale branches: giving the ghost control is a game over with its own card; Hanswurst is remembered.
var e5 = new Engine(STORY, function (ev) { out.push(ev); });
e5.start(); e5.input("goto 9");
e5.input("yes"); e5.input("mouse"); e5.input("Katzen-Café"); e5.input("Yes, take control");
var go = out[out.length - 1];
assert(e5.state.gameOver && go.kind === "gameover" && go.card === "Hello, can you hear me?", "giving control ends the game with the loop card");

var e6 = new Engine(STORY, function (ev) { out.push(ev); });
e6.start(); e6.input("goto 9");
e6.input("yes"); e6.input("mouse"); e6.input("Katzen-Café"); e6.input("Hanswurst!");
assert(e6.state.flags.hanswurst, "Hanswurst sets a flag");
var texts6 = out.map(function (e) { return e.text || ""; }).join("\n");
assert(/good choice of word/.test(texts6), "the cat remarks on Hanswurst");
assert(/bring Klaben/.test(texts6), "without Klaben Heini hands over the bell anyway");
assert(e6.currentStep().choices[0] === "Ring the bell", "finale waits at the ring question");
var snap6 = e6.snapshot(); var e7 = new Engine(STORY, function () {});
assert(e7.load(snap6) && e7.state.flags.hanswurst === true, "flags survive save/load");
var e8 = new Engine(STORY, function () {});
assert(e8.load({ room: 3, step: 0, items: ["Horn"] }) && e8.state.flags && !e8.state.flags.stoleHorn, "old saves without flags load cleanly");

if (failures) { console.error(failures + " check(s) failed"); process.exit(1); }
console.log("OK: " + STORY.rooms.length + " rooms, all checks passed");

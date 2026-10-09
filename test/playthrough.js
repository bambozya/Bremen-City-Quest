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

// 2. Full playthrough with the first advancing choice of every question.
var out = [];
var engine = new Engine(STORY, function (ev) { out.push(ev); });
engine.start();
var guard = 0;
while (!engine.state.finished && guard++ < 500) {
  if (engine.needsTravel()) { engine.arrive(); continue; }
  var step = engine.currentStep();
  if (!step || step.type !== "ask") { engine.run(); continue; }
  var pick = step.choices.filter(function (c) {
    return step.answers.some(function (a) { return !a.retry && !a.gameOver && a.match.some(function (k) { return Engine.matches(c, k); }); });
  });
  // prefer the item-granting branch when there is one
  var withItem = pick.filter(function (c) { return step.answers.some(function (a) { return a.item && a.match.some(function (k) { return Engine.matches(c, k); }); }); });
  engine.input((withItem[0] || pick[0]));
}
assert(engine.state.finished, "playthrough reaches the end (stopped at room " + engine.state.room + ")");
assert(engine.state.items.join() === "Horn,Gold,Klaben", "final items: " + engine.state.items.join());
assert(!out.some(function (e) { return e.kind === "ghost" && e.hint; }), "no hints during a perfect run");

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

if (failures) { console.error(failures + " check(s) failed"); process.exit(1); }
console.log("OK: " + STORY.rooms.length + " rooms, all checks passed");

/* Tiny pixel-art renderer: sprites are arrays of strings, one char per pixel. */
(function (global) {
  "use strict";

  var PAL = {
    ".": null,
    G: "#e6efff", // ghost body
    g: "#b9cbdc", // ghost shade
    B: "#141a24", // dark / eyes
    P: "#ff6bd6", // pink
    Y: "#ffd166", // gold
    y: "#c9962a", // gold shade
    W: "#ffffff",
    R: "#e3211a", // red
    r: "#9c130d",
    D: "#8a5a2b", // brown
    L: "#f2d5a0", // light bread / skin
    K: "#2b1d12", // hair
    S: "#6fcf97", // green
    b: "#6aa9ff",
    C: "#f0a04b", // cat fur
    c: "#b8702a", // cat stripes
    A: "#ff4d45", // arrow
    a: "#ffb3ae"  // arrow highlight
  };

  var ghostBase = [
    "....GGGG....",
    "..GGGGGGGG..",
    ".GGGGGGGGGG.",
    ".GGGGGGGGGG.",
    "GGGBBGGGBBGG",
    "GGGBBGGGBBGG",
    "GGGGGGGGGGGG",
    "GGGGGGGGGGGG",
    "GGGGGGGGGGGG",
    "GGGGGGGGGGGg",
    "GGGGGGGGGGgg",
    "G.GGG.GGG.gg",
    "G..G...G...g"
  ];
  function variant(base, rows) {
    var out = base.slice();
    for (var k in rows) out[k] = rows[k];
    return out;
  }

  var SPRITES = {
    ghost: ghostBase,
    ghostHappy: variant(ghostBase, {
      4: "GGGBBGGGBBGG", 5: "GGGGGGGGGGGG",
      7: "GGBGGGGGGBGG", 8: "GGGBBBBBBGGG"
    }),
    ghostAngry: variant(ghostBase, {
      3: ".GGBGGGGBGG.", 4: "GGGGBGGBGGGG", 5: "GGGBBGGGBBGG",
      8: "GGGBBBBBBGGG"
    }),
    ghostSleep: variant(ghostBase, {
      4: "GGGGGGGGGGGG", 5: "GGGBBGGGBBGG"
    }),
    Horn: [
      "............",
      "..........YY",
      ".........YYy",
      "........YYyy",
      "......DDYYy.",
      "....DDDDyy..",
      "..DDDDDD....",
      ".DDDDDD.....",
      "DDDDD.......",
      ".DDD........",
      "............",
      "............"
    ],
    Bell: [
      ".....YY.....",
      "....YYYY....",
      "....YYYY....",
      "...YYYYYy...",
      "...YYYYYy...",
      "...YYYYYy...",
      "..YYYYYYyy..",
      "..YYYYYYyy..",
      ".YYYYYYYYyy.",
      "yyyyyyyyyyyy",
      ".....Dy.....",
      "............"
    ],
    Gold: [
      "............",
      "............",
      "...YYYYYYY..",
      "..YWYYYYYYy.",
      ".YYYYYYYYYy.",
      ".yyyyyyyyyy.",
      "..YYYYYYY...",
      ".YWYYYYYYy..",
      "YYYYYYYYYy..",
      "yyyyyyyyyy..",
      "............",
      "............"
    ],
    Klaben: [
      "............",
      "............",
      "....DDDD....",
      "..DDLLLLDD..",
      ".DLLLDLLLLD.",
      ".DLLLLLLLLD.",
      ".DLDLLLLDLD.",
      ".DLLLLDLLLD.",
      "..DDLLLLDD..",
      "...DDDDDD...",
      "............",
      "............"
    ],
    player: [
      "....KKKK....",
      "...KKKKKK...",
      "...LLLLLL...",
      "...LBLLBL...",
      "...LLLLLL...",
      "....LLLL....",
      "..RRRRRRRR..",
      ".RRRRRRRRRR.",
      ".R.RRRRRR.R.",
      "...BBBBBB...",
      "...BB..BB...",
      "..BBB..BBB.."
    ],
    cat: [
      "............",
      ".C........C.",
      ".CC......CC.",
      ".CCCCCCCCCC.",
      ".CCCCCCCCCC.",
      ".CBCCCCCCBC.",
      ".CCCCPPCCCC.",
      ".CcCCCCCCcC.",
      "..CCCCCCCC..",
      "..CcCCCCcC..",
      "...CC..CC...",
      "............"
    ],
    arrow: [
      "......AA......",
      ".....AAAA.....",
      "....AAaaAA....",
      "...AAAaaAAA...",
      "..AAAAaaAAAA..",
      ".AAAAAaaAAAAA.",
      "AAAAAAaaAAAAAA",
      ".....AAaA.....",
      ".....AAaA.....",
      ".....AAaA.....",
      ".....AAaA.....",
      ".....AAaA.....",
      ".....AAAA.....",
      ".....AAAA....."
    ],
    pin: [
      "....RRRR....",
      "...RRRRRR...",
      "..RRRWWRRR..",
      "..RRWWWWRR..",
      "..RRWWWWRR..",
      "..RRRWWRRR..",
      "...RRRRRR...",
      "....RRRR....",
      "....RRRR....",
      ".....RR.....",
      ".....RR.....",
      "......r....."
    ]
  };

  function svg(name, size) {
    var rows = SPRITES[name];
    if (!rows) return "";
    var h = rows.length, w = rows[0].length;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" width="' + (size || w * 3) + '" height="' + ((size || w * 3) * h / w) + '" shape-rendering="crispEdges">';
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var c = PAL[rows[y][x]];
        if (c) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>';
      }
    }
    return s + "</svg>";
  }

  function el(name, size, className) {
    var span = document.createElement("span");
    span.className = "px " + (className || "");
    span.innerHTML = svg(name, size);
    return span;
  }

  global.Pixel = { svg: svg, el: el, has: function (n) { return !!SPRITES[n]; } };
})(window);

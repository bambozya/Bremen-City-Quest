/* Bremen City Quest – story data.
 *
 * Every room is a real place in Bremen. A room is unlocked when the player is
 * within `location.radius` metres of `location.lat/lng` (or in dev mode).
 * Coordinates are approximate and should be verified on site.
 *
 * Step types:
 *   { type: "text",  text }                       narration (may carry item / removeItem / flag)
 *   { type: "ghost", text }                       the ghost speaks
 *   { type: "ask",   ghost, choices, answers, hints }  a question the player must answer
 *
 * Any step may be conditional: ifItem, unlessItem, ifFlag, unlessFlag (a name or a list).
 * The step is skipped silently when a condition does not hold.
 *
 * An answer: { match: [keywords], reply?, item?, removeItem?, flag?, retry?, gameOver?, card? }
 *   retry    – print reply and ask the same question again (e.g. "No")
 *   gameOver – print reply and end the game; `card` is the text on the game-over card
 *   flag     – remember a choice that is not an item (checked with ifFlag / unlessFlag)
 * Unmatched input prints the next hint (hints cycle).
 *
 * `score` is shown on the end card: how many of the listed flags the player set.
 */
window.STORY = {
  title: "Bremen City Quest",
  score: {
    flags: { stoleHorn: "the horn", tookGold: "the gold" },
    ranks: ["An honest one. Rare.", "Half a thief. Bremen can live with that.", "A thief. Bremen has seen worse."]
  },
  rooms: [
    {
      id: 0,
      title: "Prologue",
      location: null,
      steps: [
        { type: "text", text: "Imagine waking up in a middle-age city not remembering who you are or why you are there. You look around and see old streets and people dressed in medieval fashion." },
        { type: "ghost", text: "Hello, can you hear me?" },
        { type: "text", text: "You are confused and wonder who is talking to you. You start to think it was an illusion, suddenly you hear the voice again." },
        {
          type: "ask",
          ghost: "Hey, I’m talking to you. Can you hear me?",
          choices: ["Yes", "No"],
          answers: [
            { match: ["no", "nein"], retry: true, reply: "I’m sure you can hear me." },
            { match: ["yes", "ja", "yeah", "yep"] }
          ],
          hints: ["Just answer: yes or no."]
        },
        { type: "text", text: "Some people are looking suspiciously at you because you are talking to yourself, so you try to talk silently in your head with the Ghost." },
        { type: "ghost", text: "Good. Then listen. I was a bell-founder’s apprentice in this city, in the foundry of Master Klinghe. A small bell went missing from that foundry, the one that was meant to call the free citizens of Bremen together. They say I took it. They hanged me for it. I have been wandering ever since, waiting for that bell to ring again." },
        {
          type: "ask",
          ghost: "I’m a mighty ghost without a body and you are from the future Bremen. Help me find the bell and make it ring, and I will help you find your way back to the future. So, shall we do this?",
          choices: ["Yes", "No"],
          answers: [
            { match: ["no", "nein"], gameOver: true, reply: "The voice starts to scream in an intolerable way. You put your head down and everything goes black." },
            { match: ["yes", "ja", "ok", "okay", "sure"] }
          ],
          hints: ["Yes or no? Choose wisely."]
        },
        { type: "ghost", text: "I’m glad you want to cooperate. Call me Hinrich. We should start our journey at the Sögestraße. I was a swineherd’s boy before the foundry took me, and that is where it all began. Use a map to find out where it is or just ask people around you." }
      ]
    },
    {
      id: 1,
      title: "Sögestraße – the pigs",
      location: { lat: 53.07868, lng: 8.80809, radius: 40, label: "Sögestraße (swineherd statue)" },
      steps: [
        {
          type: "ask",
          ghost: "So now we are at the Sögestraße. It’s one of the first main roads of middle-age Bremen. The street was first called ‘Platea Porcorum’ in 1261 and in 1306 the name changed to ‘Soghestrate’. It was named after the ‘Sögen’ or the pigs. Maybe you see some pigs here with their shepherd?",
          choices: ["Yes", "No"],
          answers: [
            { match: ["no", "nein"], retry: true, reply: "Somewhere at the beginning of the Sögestraße." },
            { match: ["yes", "ja"] }
          ],
          hints: ["Look around. Yes or no?"]
        },
        {
          type: "ask",
          ghost: "Good. How many pigs can you see?",
          choices: ["7", "9", "11", "13"],
          answers: [{ match: ["9", "nine", "neun"] }],
          hints: ["Oh I think you should count again.", "Count every single pig, the small ones too."]
        },
        {
          type: "ask",
          ghost: "Interesting. The pigs seem to follow the shepherd as if they are enchanted. What device is he using?",
          choices: ["Whip", "Horn", "Flute", "Bell"],
          answers: [{ match: ["horn"] }],
          hints: ["Are you sure? I heard he uses another device.", "He blows into it."]
        },
        {
          type: "ask",
          ghost: "Alright. I had one like it when I was his age. That horn is more than a toy, it works on more than pigs, trust me. It might be of use for our journey. What should we do?",
          choices: ["Steal the horn", "Do nothing"],
          answers: [
            { match: ["do nothing", "nothing", "leave", "ignore", "nichts tun", "nichts"], reply: "Do nothing. Of course. It would have been a useful tool for our next adventures. Next time you should take it into account.\n\nSuddenly you see a pig running towards you.\n\nWe should run as fast as we can to downtown. Do not turn around, I’ll shout when we are safe." },
            { match: ["steal", "take", "grab", "nehmen", "klauen", "stehlen"], item: "Horn", flag: "stoleHorn", reply: "You steal the horn from the shepherd. He gets angry and chases you.\n\nYou are really good! We should run as fast as we can downtown. Do not turn around, I’ll shout when we are safe." }
          ],
          hints: ["Steal it? Take it? Or do nothing?"]
        },
        { type: "ghost", text: "Run to where the dead are. The old churchyard. Nobody chases you into a churchyard." }
      ]
    },
    {
      id: 2,
      title: "Unser Lieben Frauen Kirchhof",
      location: { lat: 53.07668, lng: 8.80692, radius: 40, label: "Unser Lieben Frauen Kirchhof" },
      steps: [
        {
          type: "ask",
          ghost: "Wait, I feel ghosts there. I remember there was an old church near. I can’t remember its name. Maybe you should find out the name of the Church.",
          choices: ["St. Petri Dom", "Liebfrauenkirche", "St. Johann", "Stephanikirche"],
          answers: [{ match: ["liebfrauenkirche", "liebfrauen", "unser lieben frauen", "lieben frauen", "frauenkirche"] }],
          hints: ["Come on, ask around. I know people look dirty and suck, in your future world everything is clean, but just ignore that.", "The name honours Our Lady. Try it in German."]
        },
        {
          type: "ask",
          ghost: "I feel something interesting here. Maybe we should come closer to the church. In our old time, there was a huge cemetery. The church is built in gothic architecture. How many towers does the church have?",
          choices: ["1", "2", "3", "4"],
          answers: [{ match: ["2", "two", "zwei"] }],
          hints: ["Just count the towers.", "The towers don’t waggle."]
        },
        {
          type: "ask",
          ghost: "The roses on the windows are ornamental like and have hidden powers. How many roses are there on a single window?",
          choices: ["8", "10", "12", "16"],
          answers: [{ match: ["12", "twelve", "zwoelf"] }],
          hints: ["Just count the blossoms of the window.", "It is a dozen kind of number."]
        },
        { type: "text", text: "Suddenly, a bright light comes out of the window and pervades you. When your eyes clear, a thin line of it still hangs in the air, pointing across the roofs." },
        { type: "ghost", text: "Yes, that’s what I wanted. The light points. Follow it, it leads to the Dom.\n\nBy the way, the place here ‘Unser Lieben Frauen Kirchhof’ used to be the marketplace. In your time the marketplace is somewhere else. Close to the Dom there is the oldest church of Bremen. Let’s go to the Dom." }
      ]
    },
    {
      id: 3,
      title: "St. Petri Dom / Domshof",
      location: { lat: 53.07578, lng: 8.80893, radius: 45, label: "St. Petri Dom (Domshof side)" },
      steps: [
        { type: "ghost", text: "So it looks like you are at the Dom already. This place is full of mystery and magic. This cathedral is called St. Petri Dom zu Bremen. It was built around 789 in romanesque architecture and was rebuilt again to gothic architecture in the 13th century." },
        {
          type: "ask",
          ghost: "You remember what kind of windows were used in the gothic architecture?",
          choices: ["Round windows", "Rose windows", "Arrow slits", "Bull’s eyes"],
          answers: [{ match: ["rose", "rosette", "rosen", "rosenfenster"] }],
          hints: ["You have just encountered such a window.", "You have just counted the blossoms of such a window."]
        },
        {
          type: "ask",
          ghost: "Yes. Rose windows. I can feel the next move now. The cathedral. The cruelest and most violent of criminals was executed here. Do you know her name?",
          choices: ["Grete Gerken", "Gisela Grabow", "Gesche Gottfried", "Gerda Glück"],
          answers: [{ match: ["gesche", "gottfried"] }],
          hints: ["Maybe you can find some information in the cathedral or ask passers-by?", "Her name and surname start with a G."]
        },
        {
          type: "ask",
          ghost: "This malicious woman poisoned and cruelly killed her whole family, friends and partner. Many people died because of her heartlessness and greed. She was executed in 1831. It was the last public execution in Bremen. But how many persons fell victim to her?",
          choices: ["5", "10", "15", "20"],
          answers: [{ match: ["15", "fifteen", "fuenfzehn"] }],
          hints: ["They were more than 10.", "Maybe you can find some information in the cathedral or ask passers-by? A mighty ghost called GOOGLE could also give a hint."]
        },
        {
          type: "ask",
          ghost: "15 cruel crimes! In memorial for her cruel doings, there is a small stone with a cross placed on the ground in front of the northern entrance. Do you know what the stone is called?",
          choices: ["Grabstein", "Spuckstein", "Fluchstein", "Domstein"],
          answers: [{ match: ["spuckstein", "spuck", "spitting stone"] }],
          hints: ["It looks different from the other stones.", "The stone is dark and larger than the other stones.", "People spit on it. ‘Spucken’ is the German word for that."]
        },
        { type: "ghost", text: "Yes, it is called Spuckstein, because passers-by should spit on it to show their aversion against the crimes of Gesche Gottfried." },
        { type: "text", text: "You step closer to the stone and feel the ghost go quiet. For a moment the voice in your head sounds very far away." },
        { type: "ghost", text: "They hanged me not far from here. No stone for me, no cross. Nobody spits. Never mind.\n\nThe great bell up in that tower is Klinghe’s work, the master I served. The one we are looking for is smaller, and it is not here. The marketplace, that is where this city hangs its bells. Go." }
      ]
    },
    {
      id: 4,
      title: "Marktplatz / Roland",
      location: { lat: 53.07583, lng: 8.80735, radius: 45, label: "Marktplatz (Roland statue)" },
      steps: [
        {
          type: "ask",
          ghost: "The marketplace emerged in 1404 when the Bremer town hall was built. But the marketplace was in front of a different church before. Which church was it?",
          choices: ["St. Petri Dom", "Die Glocke", "Liebfrauenkirche", "St. Johann"],
          answers: [{ match: ["liebfrauenkirche", "liebfrauen", "unser lieben frauen", "lieben frauen", "frauenkirche"] }],
          hints: ["You have counted the blossoms of the rose windows of that church.", "It was there where we stopped after running away from the pigs."]
        },
        {
          type: "ask",
          ghost: "This marketplace is bigger than the marketplace of the Liebfrauenkirche and we can discover some interesting clues here. Oh see, there is this huge statue of a knight. It has stood here since 1404. What is the name of the statue?",
          choices: ["Karl der Große", "Roland", "Kaiser Wilhelm", "Hermann"],
          answers: [{ match: ["roland"] }],
          hints: ["Maybe ask one of the inhabitants.", "This statue is very famous, someone surely knows its name."]
        },
        {
          type: "ask",
          ghost: "According to the legend, Bremen will remain free and independent as long as Roland watches over the city. For that, it is alleged that a replica Roland is kept hidden in the town’s underground vaults to quickly replace the original if it is damaged. The shield of Roland looks interesting. What bird can you see on the shield?",
          choices: ["Raven", "Falcon", "Eagle", "Swan"],
          answers: [{ match: ["eagle", "adler"] }],
          hints: ["I know it has two heads, but you should recognize the bird.", "Maybe you should ask a child near you?"]
        },
        {
          type: "ask",
          ghost: "This shield has magic powers and it could be a powerful item. The shield is telling me we should search for the most famous musicians of Bremen. Do you know what they are called?",
          choices: ["Die Weser-Spatzen", "Bremer Stadtmusikanten", "Die Roland-Kapelle", "Hanse-Sänger"],
          answers: [{ match: ["stadtmusikanten", "town musicians", "musicians of bremen", "bremen town"] }],
          hints: ["Their band consists of four animals.", "Didn’t you read fairy tales in your childhood?"]
        },
        {
          type: "ask",
          ghost: "There is a statue of the Bremer Stadtmusikanten standing since 1953 at the marketplace. It is believed that a wish comes true if you touch the forelegs of the donkey. Maybe you should wish for going back to the future? Look, what animal is on top of the dog?",
          choices: ["Rooster", "Donkey", "Mouse", "Cat"],
          answers: [{ match: ["cat", "katze"] }],
          hints: ["The band consists of a donkey, a cock, a dog and a cat. You should recognize what is on top of the dog."]
        },
        { type: "ghost", text: "By the way cats are the favorite pets in Germany, they are very clean and considered very clever. Maybe we should talk to the cat." },
        { type: "text", text: "You crouch by the bronze cat. It opens one eye, and a voice that is not the ghost’s speaks inside your head, dry and unhurried:\n\n“The bell he wants is hidden in a mirage, in the street of the bells. Follow the bells. And watch what he makes you take. I will be watching too.”" },
        { type: "ghost", text: "Did it say anything? I only heard purring. Cats. The street of the bells, you say? Böttcherstraße. Bells. Let’s go." }
      ]
    },
    {
      id: 5,
      title: "Böttcherstraße",
      location: { lat: 53.07509, lng: 8.80672, radius: 40, label: "Böttcherstraße entrance (Marktplatz side)" },
      steps: [
        {
          type: "ask",
          ghost: "In the 21st century the Böttcherstraße is a popular tourist attraction. In the middle-age this street was very important and connected the marketplace with the Weser. Around 1924 two old storehouses were reconstructed into a house in which beautiful bells are integrated. Find this place. By the way, what is the name of that house?",
          choices: ["Haus der Bremer", "Robinson-Crusoe-Haus", "Haus des Glockenspiels", "Paula-Modersohn-Haus"],
          answers: [{ match: ["glockenspiel", "haus des glockenspiels"] }],
          hints: ["Maybe we should search this place here at the Böttcherstraße and it will inspire you.", "Bells plus house is basically the name but try it in German."]
        },
        { type: "ghost", text: "Yes, its name was Haus des Glockenspiels. Damn, look! The house is transforming! It looks like a house in the future! This is a mirage!" },
        { type: "text", text: "Suddenly the people around you are scared and run away." },
        {
          type: "ask",
          ghost: "The bells are beautiful! They are made from porcelain. How many bells can you count?",
          choices: ["20", "30", "36", "40"],
          answers: [{ match: ["30", "thirty", "dreissig"] }],
          hints: ["Count the bells before the mirage is gone!", "It is between 20 and 40."]
        },
        {
          type: "ask",
          ghost: "Look, the mirage is disappearing and the building crashes... What a waste. The bells are falling down, catch one of them!",
          choices: ["Run away", "Catch a bell", "Cover your head"],
          answers: [{ match: ["catch", "fangen", "take", "grab"], item: "Bell" }],
          hints: ["Don’t waste time, catch!", "C.A.T.C.H.!"]
        },
        { type: "ghost", text: "Good! That’s it. That is the one, I would know it anywhere, I filed its lip myself. Hold it tight. Now let’s run back to the beginning of the street!" },
        { type: "text", text: "The bell is small and bronze and still warm in your hand, not porcelain at all. Behind you the street has gone quiet again; a few faces peek out of the doorways." },
        { type: "ghost", text: "Catch your breath. Strange, isn’t it? A mirage that leaves something real behind. The cat said bells. I say: keep it close and keep walking." },
        { type: "text", text: "You walk back to the beginning of the Böttcherstraße and stop before a golden portrait that appears at the entrance." },
        {
          type: "ask",
          ghost: "Look at this gold! Again a mirage! The gold smelts! Take it! Take it, we can use it!",
          choices: ["Leave it", "Take the gold", "Ask the crowd"],
          answers: [
            { match: ["take", "gold", "grab", "steal", "nehmen"], item: "Gold", flag: "tookGold", reply: "Yes! Warm, isn’t it? Don’t think about where it came from." },
            { match: ["leave", "leave it", "no", "lassen"], reply: "Leave it? Gold! Running down the wall like honey and you… fine. Fine. Your loss. Mine too." }
          ],
          hints: ["Gold, take the gold!", "The crowd won’t help you. Take it or leave it."]
        },
        { type: "ghost", text: "The people around you are coming closer and they want the gold. We should continue. Böttcherstraße has many interesting buildings, you should explore it later." },
        { type: "text", text: "A grey shape winds once around your ankles. “Domsheide,” says the cat’s voice in your head, and the shape is gone." }
      ]
    },
    {
      id: 6,
      title: "Domsheide / Die Glocke",
      location: { lat: 53.07487, lng: 8.80943, radius: 45, label: "Domsheide (Die Glocke)" },
      steps: [
        { type: "text", text: "On the way the cat’s voice came back once more: something dangerous is going to happen if you don’t find your way back to the future very soon." },
        {
          type: "ask",
          ghost: "The cat is crazy. Don’t listen to it. Why are we here? Oh, here is a building that looks like a bell. What is the name of this building?",
          choices: ["Das Rathaus", "Der Schütting", "Die Glocke", "Die Bürgerschaft"],
          answers: [{ match: ["glocke", "die glocke", "bell"] }],
          hints: ["The name is on the house.", "Can’t you see the letters on the building?"]
        },
        {
          type: "ask",
          ghost: "It is strange that the cat only leads us to places with bells. This building belongs to the Domstift. It was built in the 15th century. In the 21st century it serves as a concert hall. At the entrance there are five doors with five figure friezes. What is shown on the frieze to the right of the frieze with the bell?",
          choices: ["Sword", "Mask", "Bell", "Lyre"],
          answers: [{ match: ["mask", "maske"] }],
          hints: ["This serves as a disguise.", "You can put it on your face."]
        },
        { type: "ghost", text: "Masks are there to hide faces. Beautiful buildings like the court house or the main post office are around the Domsheide area." },
        { type: "text", text: "Suddenly somebody bumps into you: a man with a stick and a stiff leg, moving faster than a stiff leg should allow. He is gone around the corner before you can turn. You look down. The bell you had with you is gone.", removeItem: "Bell" },
        { type: "ghost", text: "The bell! He took the BELL! Of everything you carry, the bell! Run, we have to get the thief! Into the Schnoor!" }
      ]
    },
    {
      id: 7,
      title: "Lange Wieren / St. Johann",
      location: { lat: 53.07400, lng: 8.80950, radius: 40, label: "St. Johann church (Lange Wieren)" },
      steps: [
        {
          type: "ask",
          ghost: "Ok, we should be near an old church, the thief should be somewhere here. Bells. Everywhere bells. Maybe we should take a look here? What is the name of the church?",
          choices: ["St. Petri", "St. Martini", "St. Johann", "St. Ansgarii"],
          answers: [{ match: ["johann", "st johann", "st. johann", "johannis"] }],
          hints: ["I guess here somewhere should be the information... I think it started with St. J..."]
        },
        {
          type: "ask",
          ghost: "Ah yes, St. Johann. The construction of this church goes back into the 14th century; at that time it was a monastery. In the 16th century it became a madhouse and in the 20th century it became a roman-catholic parish church. We are now in one of the oldest districts of Bremen. What is the name of this district?",
          choices: ["Viertel", "Schnoor", "Neustadt", "Findorff"],
          answers: [{ match: ["schnoor"] }],
          hints: ["Maybe you should look at street signs or windows.", "The passers-by surely know the name."]
        },
        {
          type: "ask",
          ghost: "The streets and houses are very tight in this district. Wires and ropes are made here for marine craft. A thief can hide well here. The first ferry service was established here, and the first bridge crossing the river was built around the year 1240. What is the name of the river?",
          choices: ["Elbe", "Lesum", "Weser", "Wümme"],
          answers: [{ match: ["weser"] }],
          hints: ["It is the only river crossing Bremen."]
        },
        { type: "ghost", ifItem: "Horn", text: "Can you smell the water? Exciting. Now, the horn. I said it works on more than pigs. Blow it. Go on." },
        { type: "text", ifItem: "Horn", text: "You put the shepherd’s horn to your lips and blow. Nothing happens to the people. But from every windowsill and doorstep of the Schnoor, cats appear, a dozen, two dozen, and every one of them turns its head the same way: down the lane, towards the river. Somewhere in that direction a stick taps on cobbles, hurrying." },
        { type: "ghost", ifItem: "Horn", text: "Told you. Where that many cats look, there is the one cat, and where the cat is, our thief will be. Follow them." },
        { type: "ghost", unlessItem: "Horn", text: "Can you smell the water? Exciting. If we had that horn now I could… never mind. We search the Schnoor the slow way. First the thief." }
      ]
    },
    {
      id: 8,
      title: "Schnoor entrance",
      location: { lat: 53.07376, lng: 8.80999, radius: 35, label: "Schnoor entrance" },
      steps: [
        { type: "ghost", text: "Look around for the thief. While you are looking, I can tell you more about this district. Somewhere around here they sell a traditional Bremer winter bread." },
        {
          type: "ask",
          ghost: "Since we are already here, we maybe should try this traditional winter bread. It is always baked in the beginning of December and enough to last till Easter. What is the name of this bread?",
          choices: ["Stuten", "Stollen", "Klaben", "Butterkuchen"],
          answers: [{ match: ["klaben"] }],
          hints: ["I guess the name is mentioned at the store window.", "The name starts with a K."]
        },
        /* The gift branch comes first: the buy branch removes the gold, which would otherwise enable the gift. */
        { type: "text", unlessItem: "Gold", text: "You have no money of any century. The baker listens to your story about a ghost and a stolen bell, laughs, and gives you a piece of Klaben anyway. “For the road. You look like you need it.”", item: "Klaben" },
        { type: "ghost", unlessItem: "Gold", text: "Charity. Hm. It would have been quicker with the gold." },
        { type: "text", ifItem: "Gold", text: "You step into the bakery and put Hinrich’s gold on the counter. The baker bites it, frowns, shrugs, and hands you a Klaben wrapped in paper.", removeItem: "Gold", item: "Klaben" },
        { type: "ghost", ifItem: "Gold", text: "See? Gold is useful. Who cares where it came from." },
        {
          type: "ask",
          ghost: "Every Bremer says he owns the only and original recipe of this bread but all have the same tradition. Oh there! The thief, stick and all, just crossed the lane and turned left. There is a restaurant called after the local Bremen beer, he could be there. What is the name of that beer?",
          choices: ["Jever", "Astra", "Beck’s", "Hemelinger"],
          answers: [{ match: ["beck", "becks", "beck's"] }],
          hints: ["The logo colors are green and white.", "Look for a logo with a green background and white words."]
        },
        { type: "text", text: "A waiter in the doorway shakes his head before you can ask. “The lame fellow? Ran past. Towards the cats, as always.”" },
        { type: "ghost", text: "The cat. Of course. It was always the cat. Oh no, the buildings are transforming again, we should hurry up! Down the street, after him!" }
      ]
    },
    {
      id: 9,
      title: "Schnoor – Katzen-Café",
      location: { lat: 53.07344, lng: 8.81012, radius: 35, label: "Katzen-Café, Schnoor" },
      steps: [
        {
          type: "ask",
          ghost: "Cats... I can smell cats... What is going on here? Can you see a sign with cats?",
          choices: ["Yes", "No"],
          answers: [
            { match: ["no", "nein"], retry: true, reply: "I smell cats, it should be somewhere here." },
            { match: ["yes", "ja"] }
          ],
          hints: ["I smell cats, it should be somewhere here. Look for house number 38.", "More than one cat, painted on a sign above a door."]
        },
        {
          type: "ask",
          ghost: "I knew it, it is surely a trap. Which animal is among the cats?",
          choices: ["Bird", "Mouse", "Fish", "Dog"],
          answers: [{ match: ["mouse", "maus", "mice"] }],
          hints: ["It is small and likes cheese.", "The murderer Gesche killed her victims with a poison made for that animal."]
        },
        {
          type: "ask",
          ghost: "It all makes sense now! We are the mice with which the cat is playing! What is the name of the building with the cats?",
          choices: ["Café Miau", "Katzen-Café", "Zum Schnurrhaar", "Samtpfote"],
          answers: [{ match: ["katzen", "katzencafe", "katzen-cafe", "cat cafe"] }],
          hints: ["Read the sign above the door at Schnoor 38. The name says exactly what you smelled.", "Cats are ‘Katzen’ in German. The rest is where you would drink a coffee."]
        },
        { type: "ghost", text: "I don’t remember a name like ‘Katzen-Café’ existing in my time. This building is also a mirage! Look, the cat from the marketplace. And the thief, sitting right beside it, with our bell!" },
        { type: "text", text: "The man with the stick sits on the step beside the cat. He is old, grey-whiskered and harmless-looking, and very pleased with himself. The cat looks at you the way it looked at you on the marketplace." },
        {
          type: "ask",
          ghost: "He is giving it the bell! You should let me take control over your mind to fight the cat with your magic items. Give me control!",
          choices: ["Yes, take control", "Never!", "Hanswurst!"],
          answers: [
            { match: ["yes", "take control", "control", "kontrolle", "uebernimm"], gameOver: true, card: "Hello, can you hear me?", reply: "Thank you. Finally.\n\nYour hands move without you. They push past the cat, take the bell from the old man, and ring it. The sound is small and wrong. The lane goes white, then grey, then nothing, and from very far away you hear your own voice say to a stranger: Hello, can you hear me?" },
            { match: ["never", "nein", "no", "niemals"], reply: "Never? NEVER? After everything I have done for you?" },
            { match: ["hanswurst"], flag: "hanswurst", reply: "HANSWURST? I pour bells for a living, I have been dead six hundred years, and you call me HANSWURST?!" }
          ],
          hints: ["Come on, with its power I can save us! Really!", "Do you really want to hand your mind to a ghost? Maybe call it a name instead. A German one. Something with sausage."]
        },
        { type: "text", text: "The ghost screams. It is the scream from the very beginning, the one that turns everything black, and it is coming from inside your own head." },
        { type: "text", ifItem: "Horn", text: "You put the horn to your lips and blow. The scream stops like a door slammed shut. Somewhere in the dark behind your eyes something small and furious is holding its ears." },
        { type: "ghost", ifItem: "Horn", text: "Fine. FINE. I did say it works on more than pigs." },
        { type: "text", unlessItem: "Horn", text: "Your knees go. The cobbles come up to meet you. The scream goes on and on, and you understand that it does not need to stop, that he can do this for six hundred years if he has to. Then the cat yowls, one long note that cuts through the scream like wire through clay, and the scream frays, thins, and is gone. You are on all fours in the Schnoor with the taste of blood where you bit your tongue. The cat licks a paw." },
        { type: "ghost", unlessItem: "Horn", text: "…All right. All right. That was unnecessary. Of the cat, I mean." },
        { type: "text", text: "The cat speaks, and this time the old man seems to hear it too.\n\n“Now you know what he is. Hinrich, apprentice, thief. He took the citizens’ bell from Klinghe’s foundry and hid it, and they hanged him before he could say where. I have kept it in a mirage ever since, out of his reach. It must ring in an honest living hand, here, where the rope-makers of the Schnoor once rang it to warn of thieves. Then he can rest, and you can go home.”" },
        { type: "text", text: "You look at the man with the stick. “Heini,” says the cat. “Heini Holtenbeen. Lived at number 8, limped through this quarter his whole life and never stole anything but a laugh. The city keeps its useful dead. He runs my errands. He is also always hungry.”" },
        { type: "text", unlessItem: "Klaben", text: "Heini holds out the bell with one hand. The other is open, palm up. You have nothing to put in it. He sighs, and puts the bell in your hand anyway. “Next time,” he says, “bring Klaben.”", item: "Bell" },
        { type: "text", ifItem: "Klaben", text: "Heini holds out the bell with one hand. The other is open, palm up, and his eyes are on the paper parcel in your pocket. You give him the Klaben. He bites into it, closes his eyes, and puts the bell in your hand.", removeItem: "Klaben", item: "Bell" },
        { type: "text", unlessFlag: ["stoleHorn", "tookGold"], text: "The cat looks at you for a long moment. “Twice he told you to take what was not yours. Twice you did not. An honest one. Rare. Ring it.”" },
        { type: "text", ifFlag: "stoleHorn", unlessFlag: "tookGold", text: "The cat looks at you for a long moment. “You took the horn when he said take it. The gold you left. Half a thief. Bremen can live with that. Ring it.”" },
        { type: "text", ifFlag: "tookGold", unlessFlag: "stoleHorn", text: "The cat looks at you for a long moment. “You left the horn, and took the gold when he said take it. Half a thief. Bremen can live with that. The gold was mirage gold, by the way. The baker’s till will hold a lump of coal by morning. Ring it.”" },
        { type: "text", ifFlag: ["stoleHorn", "tookGold"], text: "The cat looks at you for a long moment. “Horn and gold. Both times he said take, you took. The gold was mirage gold, by the way; the baker’s till will hold a lump of coal by morning. Ring it anyway. Then go, before I change my mind.”" },
        { type: "text", ifFlag: "hanswurst", text: "“Hanswurst,” the cat adds, “was a good choice of word.”" },
        {
          type: "ask",
          ghost: "…Go on, then. Ring it. I would like to stop now.",
          choices: ["Ring the bell", "Keep it"],
          answers: [
            { match: ["keep", "keep it", "behalten"], retry: true, reply: "Please." },
            { match: ["ring", "ring the bell", "laeuten", "klingeln"] }
          ],
          hints: ["It is a bell. There is one thing you do with a bell."]
        },
        { type: "text", text: "You ring the bell. The sound is small and clear and completely right. The Katzen-Café, the lane, the sky above it ripple like water and go still again, and the old man and the cat are no longer there." },
        { type: "ghost", text: "Thank you. I mean it, for once. I did take it. I was going to sell it. I was sixteen and stupid and then I was dead, and six hundred years is a long time to be sorry.\n\nGoodbye, future person. Spit on a stone for me." },
        { type: "text", text: "The voice is gone. You wake up on the cobbles at Schnoor 38, today, phone in your hand, a bakery smell in the air. A few steps away, by the Concordenhaus, a bronze man with a stick is grinning at nothing in particular. In your pocket there is a small bronze bell that was not there this morning." }
      ]
    }
  ]
};

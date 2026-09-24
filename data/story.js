/* Bremen City Quest – story data.
 *
 * Every room is a real place in Bremen. A room is unlocked when the player is
 * within `location.radius` metres of `location.lat/lng` (or in dev mode).
 * Coordinates are approximate and should be verified on site.
 *
 * Step types:
 *   { type: "text",  text }                       narration
 *   { type: "ghost", text }                       the ghost speaks
 *   { type: "ask",   ghost, answers, hints }      a question the player must answer
 *
 * An answer: { match: [keywords], reply?, item?, removeItem?, retry?, gameOver? }
 *   retry    – print reply and ask the same question again (e.g. "No")
 *   gameOver – print reply and end the game
 * Unmatched input prints the next hint (hints cycle).
 */
window.STORY = {
  title: "Bremen City Quest",
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
          answers: [
            { match: ["no", "nein"], retry: true, reply: "I’m sure you can hear me." },
            { match: ["yes", "ja", "yeah", "yep"] }
          ],
          hints: ["Just answer: yes or no."]
        },
        { type: "text", text: "Some people are looking suspiciously at you because you are talking to yourself, so you try to talk silently in your head with the Ghost." },
        {
          type: "ask",
          ghost: "I’m a mighty ghost without a body and you are from the future Bremen. Maybe you can help me remove my curse and I will help you find your way back to the future. So, shall we do this?",
          answers: [
            { match: ["no", "nein"], gameOver: true, reply: "The voice starts to scream in an intolerable way. You put your head down and everything goes black." },
            { match: ["yes", "ja", "ok", "okay", "sure"] }
          ],
          hints: ["Yes or no? Choose wisely."]
        },
        { type: "ghost", text: "I’m glad you want to cooperate. We should start our journey at the Sögestraße. Use a map to find out where it is or just ask people around you." }
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
          answers: [
            { match: ["no", "nein"], retry: true, reply: "Somewhere at the beginning of the Sögestraße." },
            { match: ["yes", "ja"] }
          ],
          hints: ["Look around. Yes or no?"]
        },
        {
          type: "ask",
          ghost: "Good. How many pigs can you see?",
          answers: [{ match: ["9", "nine", "neun"] }],
          hints: ["Oh I think you should count again.", "Count every single pig, the small ones too."]
        },
        {
          type: "ask",
          ghost: "Interesting. The pigs seem to follow the shepherd as if they are enchanted. What device is he using?",
          answers: [{ match: ["horn"] }],
          hints: ["Are you sure? I heard he uses another device.", "He blows into it."]
        },
        {
          type: "ask",
          ghost: "Alright, it might be of use for our journey. What should we do?",
          answers: [
            { match: ["nothing", "do nothing", "leave", "ignore"], reply: "It would have been a useful tool for our next adventures. Next time you should take it into account.\n\nSuddenly you see a pig running towards you.\n\nWe should run as fast as we can to downtown. Do not turn around, I’ll shout when we are safe." },
            { match: ["steal", "take", "grab", "nehmen", "klauen"], item: "Horn", reply: "You steal the horn from the shepherd. He gets angry and chases you.\n\nYou are really good! We should run as fast as we can downtown. Do not turn around, I’ll shout when we are safe." }
          ],
          hints: ["Steal it? Take it? Or do nothing?"]
        }
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
          answers: [{ match: ["liebfrauenkirche", "liebfrauen", "unser lieben frauen", "lieben frauen", "frauenkirche"] }],
          hints: ["Come on, ask around. I know people look dirty and suck, in your future world everything is clean, but just ignore that.", "The name honours Our Lady. Try it in German."]
        },
        {
          type: "ask",
          ghost: "I feel something interesting here. Maybe we should come closer to the church. In our old time, there was a huge cemetery. The church is built in gothic architecture. How many towers does the church have?",
          answers: [{ match: ["2", "two", "zwei"] }],
          hints: ["Just count the towers.", "The towers don’t waggle."]
        },
        {
          type: "ask",
          ghost: "The roses on the windows are ornamental like and have hidden powers. How many roses are there on a single window?",
          answers: [{ match: ["12", "twelve", "zwoelf"] }],
          hints: ["Just count the blossoms of the window.", "It is a dozen kind of number."]
        },
        { type: "text", text: "Suddenly, a bright light comes out of the window and pervades you." },
        { type: "ghost", text: "Yes, that’s what I wanted. Now I see our next move. We should go to the Dom.\n\nBy the way, the place here ‘Unser Lieben Frauen Kirchhof’ used to be the marketplace. In your time the marketplace is somewhere else. Close to the Dom there is the oldest church of Bremen. Let’s go to the Dom." }
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
          answers: [{ match: ["rose", "rosette", "rosen", "rosenfenster"] }],
          hints: ["You have just encountered such a window.", "You have just counted the blossoms of such a window."]
        },
        {
          type: "ask",
          ghost: "Yes. Rose windows. I can feel the next move now. The cathedral. The cruelest and most violent of criminals was executed here. Do you know her name?",
          answers: [{ match: ["gesche", "gottfried"] }],
          hints: ["Maybe you can find some information in the cathedral or ask passers-by?", "Her name and surname start with a G."]
        },
        {
          type: "ask",
          ghost: "This malicious woman poisoned and cruelly killed her whole family, friends and partner. Many people died because of her heartlessness and greed. She was executed in 1831. It was the last public execution in Bremen. But how many persons fell victim to her?",
          answers: [{ match: ["15", "fifteen", "fuenfzehn"] }],
          hints: ["They were more than 10.", "Maybe you can find some information in the cathedral or ask passers-by? A mighty ghost called GOOGLE could also give a hint."]
        },
        {
          type: "ask",
          ghost: "15 cruel crimes! In memorial for her cruel doings, there is a small stone with a cross placed on the ground in front of the northern entrance. Do you know what the stone is called?",
          answers: [{ match: ["spuckstein", "spuck", "spitting stone"] }],
          hints: ["It looks different from the other stones.", "The stone is dark and larger than the other stones.", "People spit on it. ‘Spucken’ is the German word for that."]
        },
        { type: "ghost", text: "Yes, it is called Spuckstein, because passers-by should spit on it to show their aversion against the crimes of Gesche Gottfried." },
        { type: "text", text: "You touch the scaffold and you feel the ghost becoming distracted." },
        { type: "ghost", text: "Ehm, maybe we should go to the marketplace, I don’t understand why the rosette window led us to this cathedral in the first place." }
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
          answers: [{ match: ["liebfrauenkirche", "liebfrauen", "unser lieben frauen", "lieben frauen", "frauenkirche"] }],
          hints: ["You have counted the blossoms of the rose windows of that church.", "It was there where we stopped after running away from the pigs."]
        },
        {
          type: "ask",
          ghost: "This marketplace is bigger than the marketplace of the Liebfrauenkirche and we can discover some interesting clues here. Oh see, there is this huge statue of a knight. It has stood here since 1404. What is the name of the statue?",
          answers: [{ match: ["roland"] }],
          hints: ["Maybe ask one of the inhabitants.", "This statue is very famous, someone surely knows its name."]
        },
        {
          type: "ask",
          ghost: "According to the legend, Bremen will remain free and independent as long as Roland watches over the city. For that, it is alleged that a replica Roland is kept hidden in the town’s underground vaults to quickly replace the original if it is damaged. The shield of Roland looks interesting. What bird can you see on the shield?",
          answers: [{ match: ["eagle", "adler"] }],
          hints: ["I know it has two heads, but you should recognize the bird.", "Maybe you should ask a child near you?"]
        },
        {
          type: "ask",
          ghost: "This shield has magic powers and it could be a powerful item. The shield is telling me we should search for the most famous musicians of Bremen. Do you know what they are called?",
          answers: [{ match: ["stadtmusikanten", "town musicians", "musicians of bremen", "bremen town"] }],
          hints: ["Their band consists of four animals.", "Didn’t you read fairy tales in your childhood?"]
        },
        {
          type: "ask",
          ghost: "There is a statue of the Bremer Stadtmusikanten standing since 1953 at the marketplace. It is believed that a wish comes true if you touch the forelegs of the donkey. Maybe you should wish for going back to the future? Look, what animal is on top of the dog?",
          answers: [{ match: ["cat", "katze"] }],
          hints: ["The band consists of a donkey, a cock, a dog and a cat. You should recognize what is on top of the dog."]
        },
        { type: "ghost", text: "By the way cats are the favorite pets in Germany, they are very clean and considered very clever. Maybe we should talk to the cat." },
        { type: "text", text: "You had a long talk with the cat, you had some milk, played ball and the cat recommended you to visit the Böttcherstraße." }
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
          answers: [{ match: ["glockenspiel", "haus des glockenspiels"] }],
          hints: ["Maybe we should search this place here at the Böttcherstraße and it will inspire you.", "Bells plus house is basically the name but try it in German."]
        },
        { type: "ghost", text: "Yes, its name was Haus des Glockenspiels. Damn, look! The house is transforming! It looks like a house in the future! This is a mirage!" },
        { type: "text", text: "Suddenly the people around you are scared and run away." },
        {
          type: "ask",
          ghost: "The bells are beautiful! They are made from porcelain. How many bells can you count?",
          answers: [{ match: ["30", "thirty", "dreissig"] }],
          hints: ["Count the bells before the mirage is gone!", "It is between 20 and 40."]
        },
        {
          type: "ask",
          ghost: "Look, the mirage is disappearing and the building crashes... What a waste. The bells are falling down, catch one of them!",
          answers: [{ match: ["catch", "fangen", "take", "grab"], item: "Bell" }],
          hints: ["Don’t waste time, catch!", "C.A.T.C.H.!"]
        },
        { type: "ghost", text: "Good! Now let’s run back to the beginning of the street! Oh look, one of the craftsmen dropped a glass figure..." },
        { type: "text", text: "You run to the beginning of the Böttcherstraße and stop before a golden portrait that appears at the entrance." },
        {
          type: "ask",
          ghost: "Look at this gold! Again a mirage! The gold smelts! Take it!",
          answers: [{ match: ["take", "gold", "grab", "steal", "nehmen"], item: "Gold" }],
          hints: ["Gold, take the gold!", "T.A.K.E. G.O.L.D.!"]
        },
        { type: "ghost", text: "The people around you are coming closer and they want the gold. We should continue. But why did the cat lead us this way? Böttcherstraße has many interesting buildings, you should explore it later." },
        { type: "text", text: "As you talked to the cat it told you that you have to go to a place called Domsheide." }
      ]
    },
    {
      id: 6,
      title: "Domsheide / Die Glocke",
      location: { lat: 53.07487, lng: 8.80943, radius: 45, label: "Domsheide (Die Glocke)" },
      steps: [
        { type: "text", text: "The cat explained that it feels something dangerous is going to happen if you don’t find your way back to the future very soon." },
        {
          type: "ask",
          ghost: "The cat is crazy. Don’t listen to it. Why are we here? Oh, here is a building that looks like a bell. What is the name of this building?",
          answers: [{ match: ["glocke", "die glocke", "bell"] }],
          hints: ["The name is on the house.", "Can’t you see the letters on the building?"]
        },
        {
          type: "ask",
          ghost: "It is strange that the cat only leads us to places with bells. This building belongs to the Domstift. It was built in the 15th century. In the 21st century it serves as a concert hall. At the entrance there are five doors with five figure friezes. What is shown on the frieze to the right of the frieze with the bell?",
          answers: [{ match: ["mask", "maske"] }],
          hints: ["This serves as a disguise.", "You can put it on your face."]
        },
        { type: "ghost", text: "Masks are there to hide faces. Beautiful buildings like the court house or the main post office are around the Domsheide area." },
        { type: "text", text: "Suddenly somebody bumps into you and runs away. You look around and notice that the bell you had with you is now gone.", removeItem: "Bell" },
        { type: "ghost", text: "Run, we have to get the thief!" }
      ]
    },
    {
      id: 7,
      title: "Lange Wieren / St. Johann",
      location: { lat: 53.07400, lng: 8.80950, radius: 40, label: "St. Johann church (Lange Wieren)" },
      steps: [
        {
          type: "ask",
          ghost: "Ok, we should be near an old church, the thief should be somewhere here. Maybe we should take a look here? What is the name of the church?",
          answers: [{ match: ["johann", "st johann", "st. johann", "johannis"] }],
          hints: ["I guess here somewhere should be the information... I think it started with St. J..."]
        },
        {
          type: "ask",
          ghost: "Ah yes, St. Johann. The construction of this church goes back into the 14th century; at that time it was a monastery. In the 16th century it became a madhouse and in the 20th century it became a roman-catholic parish church. We are now in one of the oldest districts of Bremen. What is the name of this district?",
          answers: [{ match: ["schnoor"] }],
          hints: ["Maybe you should look at street signs or windows.", "The passers-by surely know the name."]
        },
        {
          type: "ask",
          ghost: "The streets and houses are very tight in this district. Wires and ropes are made here for marine craft. A thief can hide well here. The first ferry service was established here, and the first bridge crossing the river was built around the year 1240. What is the name of the river?",
          answers: [{ match: ["weser"] }],
          hints: ["It is the only river crossing Bremen."]
        },
        { type: "ghost", text: "Can you smell the water? Exciting, but we must first search the Schnoor to find the thief." }
      ]
    },
    {
      id: 8,
      title: "Schnoor – the bakery",
      location: { lat: 53.07376, lng: 8.80999, radius: 35, label: "Schnoor entrance (bakery)" },
      steps: [
        {
          type: "ask",
          ghost: "Look around for the thief. While you are looking, I can tell you more about this district. Here is a cake shop and bakery which sells a traditional Bremer winter bread. Can you find the bakery and find out its name?",
          answers: [{ match: ["schnaares", "schnaare", "schnoor baeckerei", "schnoor bakery"] }],
          hints: ["The building should be grey.", "The name is on the sign on the top."]
        },
        {
          type: "ask",
          ghost: "Since we are already here, we maybe should try this traditional winter bread. It is always baked in the beginning of December and enough to last till Easter. What is the name of this bread?",
          answers: [{ match: ["klaben"], item: "Klaben" }],
          hints: ["I guess the name is mentioned at the store window.", "The name starts with a K."]
        },
        {
          type: "ask",
          ghost: "Every Bremer says he owns the only and original recipe of this bread but all have the same tradition. Look, this woman dropped her Klaben. We take it to strengthen us... Oh there, the thief just ran across the Schnoor and turned left. There is a restaurant called after the local Bremen beer, he could be there. What is the name of that beer?",
          answers: [{ match: ["beck", "becks", "beck's"] }],
          hints: ["The logo colors are green and white.", "Look for a logo with a green background and white words."]
        },
        { type: "ghost", text: "Beck’s beer has been brewed in Bremen since 1873... Oh no, the buildings are transforming again, we should hurry up! Look, the thief is running down the street. Let us follow him!" }
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
          answers: [
            { match: ["no", "nein"], retry: true, reply: "I smell cats, it should be somewhere here." },
            { match: ["yes", "ja"] }
          ],
          hints: ["I guess there is more than one cat on the sign. Yes or no?"]
        },
        {
          type: "ask",
          ghost: "I knew it, it is surely a trap. Which animal is among the cats?",
          answers: [{ match: ["mouse", "maus", "mice"] }],
          hints: ["It is small and likes cheese.", "The murderer Gesche killed her victims with a poison made for that animal."]
        },
        {
          type: "ask",
          ghost: "It all makes sense now! We are the mice with which the cat is playing! What is the name of the building with the cats?",
          answers: [{ match: ["katzen", "katzencafe", "katzen-cafe", "cat cafe"] }],
          hints: ["The name does not include the word ‘restaurant’.", "Maybe you ask a passer-by for glasses?"]
        },
        {
          type: "ask",
          ghost: "I don’t remember a name like ‘Katzen-Cafe’ existing in the Middle-Ages. This building is also a mirage! Look, the cat from the marketplace and the thief. The thief is giving it the stolen bell! You should let me take control over your mind to fight the cat with your magic items. Give me control!",
          answers: [{ match: ["hanswurst"] }],
          hints: ["Come on, with its power I can save us! Really!", "Do you really want to hand your mind to a ghost? Maybe call it a name instead. A German one. Something with sausage."]
        },
        { type: "text", text: "Mwahahaha, you cannot give the ghost control over your mind, so the story ends here. But maybe, one day you can find out what happened next." }
      ]
    }
  ]
};

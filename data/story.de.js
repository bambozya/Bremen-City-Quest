/* Bremen City Quest – deutsche Texte.
 *
 * Dies ist eine Übersetzungs-Schicht über data/story.js. Struktur, Koordinaten und die
 * Antwort-Stichwörter (`match`) bleiben dort; hier stehen nur Texte, Schritt für Schritt
 * in derselben Reihenfolge. Ein String ersetzt den Text eines text-/ghost-Schritts, ein
 * Objekt { ghost, choices, hints, replies?, cards? } einen ask-Schritt. `replies` und
 * `cards` sind in der Reihenfolge der `answers` des Basis-Schritts (null = keine Antwort).
 * Der Test prüft, dass beide Dateien gleich aufgebaut sind.
 */
window.STORY_DE = {
  title: "Bremen City Quest",
  itemNames: { Horn: "Horn", Bell: "Glocke", Gold: "Gold", Klaben: "Klaben" },
  score: {
    ranks: ["Ein ehrlicher Mensch. Selten.", "Ein halber Dieb. Damit kann Bremen leben.", "Ein Dieb. Bremen hat Schlimmeres gesehen."]
  },
  rooms: [
    {
      title: "Prolog",
      steps: [
        "Stell dir vor, du wachst in einer mittelalterlichen Stadt auf und weißt nicht mehr, wer du bist oder warum du hier bist. Du siehst dich um: alte Gassen, Menschen in mittelalterlicher Kleidung.",
        "Hallo? Kannst du mich hören?",
        "Du bist verwirrt und fragst dich, wer da spricht. Gerade als du es für Einbildung hältst, hörst du die Stimme wieder.",
        {
          ghost: "He, ich rede mit dir. Kannst du mich hören?",
          choices: ["Ja", "Nein"],
          replies: ["Ich bin sicher, dass du mich hörst.", null],
          hints: ["Antworte einfach: ja oder nein."]
        },
        "Ein paar Leute sehen dich misstrauisch an, weil du mit dir selbst redest. Also versuchst du, in Gedanken mit dem Geist zu sprechen.",
        "Gut. Dann hör zu. Ich war Glockengießerlehrling in dieser Stadt, in der Gießerei von Meister Klinghe. Aus dieser Gießerei verschwand eine kleine Glocke, die eine, die die freien Bürger Bremens zusammenrufen sollte. Man sagt, ich hätte sie genommen. Dafür haben sie mich gehängt. Seitdem wandere ich umher und warte darauf, dass diese Glocke wieder läutet.",
        {
          ghost: "Ich bin ein mächtiger Geist ohne Körper, und du kommst aus dem Bremen der Zukunft. Hilf mir, die Glocke zu finden und zum Läuten zu bringen, und ich helfe dir, den Weg zurück in die Zukunft zu finden. Also, machen wir das?",
          choices: ["Ja", "Nein"],
          replies: ["Die Stimme beginnt unerträglich zu schreien. Du senkst den Kopf, und alles wird schwarz.", null],
          hints: ["Ja oder nein? Wähle weise."]
        },
        "Ich bin froh, dass du mitmachst. Nenn mich Hinrich. Wir beginnen unsere Reise in der Sögestraße. Ich war Schweinehirtenjunge, bevor die Gießerei mich nahm, und dort hat alles angefangen. Nimm eine Karte oder frag einfach die Leute um dich herum."
      ]
    },
    {
      title: "Sögestraße – die Schweine",
      label: "Sögestraße (Schweinehirt-Skulptur)",
      steps: [
        {
          ghost: "So, jetzt sind wir in der Sögestraße. Sie ist eine der ersten Hauptstraßen des mittelalterlichen Bremen. 1261 hieß sie noch ‚Platea Porcorum‘, 1306 wurde daraus ‚Soghestrate‘. Benannt ist sie nach den ‚Sögen‘, den Schweinen. Siehst du hier vielleicht ein paar Schweine mit ihrem Hirten?",
          choices: ["Ja", "Nein"],
          replies: ["Irgendwo am Anfang der Sögestraße.", null],
          hints: ["Sieh dich um. Ja oder nein?"]
        },
        {
          ghost: "Gut. Wie viele Schweine siehst du?",
          choices: ["7", "9", "11", "13"],
          hints: ["Oh, ich glaube, du solltest noch einmal zählen.", "Zähl jedes einzelne Schwein, auch die kleinen."]
        },
        {
          ghost: "Interessant. Die Schweine folgen dem Hirten, als wären sie verzaubert. Welches Gerät benutzt er?",
          choices: ["Peitsche", "Horn", "Flöte", "Glocke"],
          hints: ["Bist du sicher? Ich habe gehört, er benutzt etwas anderes.", "Er bläst hinein."]
        },
        {
          ghost: "Na gut. Ich hatte so eins, als ich so alt war wie er. Das Horn ist mehr als ein Spielzeug, es wirkt nicht nur auf Schweine, glaub mir. Es könnte uns auf der Reise nützlich sein. Was machen wir?",
          choices: ["Das Horn stehlen", "Nichts tun"],
          replies: [
            "Nichts tun. Natürlich. Es wäre ein nützliches Werkzeug für unsere nächsten Abenteuer gewesen. Nächstes Mal denk daran.\n\nPlötzlich siehst du ein Schwein auf dich zurennen.\n\nWir sollten so schnell wie möglich in die Stadt laufen. Dreh dich nicht um, ich rufe, wenn wir in Sicherheit sind.",
            "Du stiehlst dem Hirten das Horn. Er wird wütend und jagt dich.\n\nDu bist wirklich gut! Wir sollten so schnell wie möglich in die Stadt laufen. Dreh dich nicht um, ich rufe, wenn wir in Sicherheit sind."
          ],
          hints: ["Stehlen? Nehmen? Oder nichts tun?"]
        },
        "Lauf dorthin, wo die Toten sind. Zum alten Kirchhof. In einen Kirchhof folgt dir niemand."
      ]
    },
    {
      title: "Unser Lieben Frauen Kirchhof",
      label: "Unser Lieben Frauen Kirchhof",
      steps: [
        {
          ghost: "Warte, ich spüre hier Geister. Ich erinnere mich an eine alte Kirche in der Nähe. Der Name fällt mir nicht ein. Finde doch heraus, wie die Kirche heißt.",
          choices: ["St. Petri Dom", "Liebfrauenkirche", "St. Johann", "Stephanikirche"],
          hints: ["Komm schon, frag herum. Ich weiß, die Leute sehen schmutzig aus und stinken, in deiner Zukunftswelt ist alles sauber, aber ignorier das einfach.", "Der Name ehrt Unsere Liebe Frau."]
        },
        {
          ghost: "Ich spüre hier etwas Interessantes. Gehen wir näher an die Kirche. Zu meiner Zeit war hier ein großer Friedhof. Die Kirche ist gotisch gebaut. Wie viele Türme hat sie?",
          choices: ["1", "2", "3", "4"],
          hints: ["Zähl einfach die Türme.", "Die Türme wackeln nicht."]
        },
        {
          ghost: "Die Rosen in den Fenstern sind wie Ornamente und haben verborgene Kräfte. Wie viele Rosen sind in einem einzelnen Fenster?",
          choices: ["8", "10", "12", "16"],
          hints: ["Zähl einfach die Blüten des Fensters.", "Ein Dutzend ist eine gute Zahl."]
        },
        "Plötzlich bricht ein helles Licht aus dem Fenster und durchdringt dich. Als deine Augen wieder klar sind, hängt noch ein dünner Strahl davon in der Luft und zeigt über die Dächer.",
        "Ja, genau das wollte ich. Das Licht zeigt den Weg. Folge ihm, es führt zum Dom.\n\nÜbrigens: Der Platz hier, ‚Unser Lieben Frauen Kirchhof‘, war früher der Marktplatz. In deiner Zeit ist der Marktplatz woanders. Nahe beim Dom steht die älteste Kirche Bremens. Gehen wir zum Dom."
      ]
    },
    {
      title: "St. Petri Dom / Domshof",
      label: "St. Petri Dom (Seite Domshof)",
      steps: [
        "Du bist also schon am Dom. Dieser Ort ist voller Geheimnisse und Magie. Die Kathedrale heißt St. Petri Dom zu Bremen. Sie wurde um 789 im romanischen Stil gebaut und im 13. Jahrhundert gotisch umgebaut.",
        {
          ghost: "Weißt du noch, welche Fenster in der Gotik verwendet wurden?",
          choices: ["Rundfenster", "Rosenfenster", "Schießscharten", "Ochsenaugen"],
          hints: ["So ein Fenster hast du gerade gesehen.", "Du hast gerade die Blüten eines solchen Fensters gezählt."]
        },
        {
          ghost: "Ja. Rosenfenster. Jetzt spüre ich den nächsten Schritt. Die Kathedrale. Die grausamste Verbrecherin wurde hier hingerichtet. Kennst du ihren Namen?",
          choices: ["Grete Gerken", "Gisela Grabow", "Gesche Gottfried", "Gerda Glück"],
          hints: ["Vielleicht findest du Informationen im Dom oder fragst Passanten?", "Vor- und Nachname beginnen mit G."]
        },
        {
          ghost: "Diese bösartige Frau hat ihre ganze Familie, Freunde und ihren Partner vergiftet und grausam getötet. Viele Menschen starben durch ihre Herzlosigkeit und Gier. Sie wurde 1831 hingerichtet, es war die letzte öffentliche Hinrichtung in Bremen. Aber wie viele Menschen fielen ihr zum Opfer?",
          choices: ["5", "10", "15", "20"],
          hints: ["Es waren mehr als 10.", "Vielleicht findest du Informationen im Dom oder fragst Passanten? Ein mächtiger Geist namens GOOGLE könnte auch helfen."]
        },
        {
          ghost: "15 grausame Verbrechen! Zur Erinnerung an ihre Taten liegt vor dem Nordeingang ein kleiner Stein mit einem Kreuz im Boden. Weißt du, wie der Stein heißt?",
          choices: ["Grabstein", "Spuckstein", "Fluchstein", "Domstein"],
          hints: ["Er sieht anders aus als die anderen Steine.", "Der Stein ist dunkel und größer als die anderen.", "Die Leute spucken darauf."]
        },
        "Ja, er heißt Spuckstein, weil Passanten darauf spucken sollen, um ihre Abscheu vor den Verbrechen der Gesche Gottfried zu zeigen.",
        "Du trittst näher an den Stein und spürst, wie der Geist still wird. Einen Moment lang klingt die Stimme in deinem Kopf sehr weit weg.",
        "Mich haben sie nicht weit von hier gehängt. Kein Stein für mich, kein Kreuz. Niemand spuckt. Egal.\n\nDie große Glocke oben im Turm ist Klinghes Werk, der Meister, dem ich gedient habe. Die, die wir suchen, ist kleiner, und sie ist nicht hier. Der Marktplatz, dort hängt diese Stadt ihre Glocken auf. Geh."
      ]
    },
    {
      title: "Marktplatz / Roland",
      label: "Marktplatz (Roland)",
      steps: [
        {
          ghost: "Der Marktplatz entstand 1404, als das Bremer Rathaus gebaut wurde. Vorher lag der Markt vor einer anderen Kirche. Welche war das?",
          choices: ["St. Petri Dom", "Die Glocke", "Liebfrauenkirche", "St. Johann"],
          hints: ["Du hast die Blüten der Rosenfenster dieser Kirche gezählt.", "Dort haben wir angehalten, nachdem wir vor den Schweinen weggelaufen sind."]
        },
        {
          ghost: "Dieser Marktplatz ist größer als der an der Liebfrauenkirche, und hier gibt es interessante Hinweise. Oh, sieh nur, die riesige Statue eines Ritters. Sie steht hier seit 1404. Wie heißt die Statue?",
          choices: ["Karl der Große", "Roland", "Kaiser Wilhelm", "Hermann"],
          hints: ["Frag doch einen der Einwohner.", "Die Statue ist sehr berühmt, irgendjemand kennt sicher den Namen."]
        },
        {
          ghost: "Der Legende nach bleibt Bremen frei und unabhängig, solange Roland über die Stadt wacht. Angeblich wird deshalb ein zweiter Roland in den Kellern der Stadt versteckt, um das Original schnell zu ersetzen, falls es beschädigt wird. Rolands Schild sieht interessant aus. Welchen Vogel siehst du darauf?",
          choices: ["Rabe", "Falke", "Adler", "Schwan"],
          hints: ["Ich weiß, er hat zwei Köpfe, aber den Vogel solltest du erkennen.", "Frag vielleicht ein Kind in deiner Nähe?"]
        },
        {
          ghost: "Dieser Schild hat magische Kräfte und könnte ein mächtiger Gegenstand sein. Der Schild sagt mir, wir sollen die berühmtesten Musiker Bremens suchen. Weißt du, wie sie heißen?",
          choices: ["Die Weser-Spatzen", "Bremer Stadtmusikanten", "Die Roland-Kapelle", "Hanse-Sänger"],
          hints: ["Ihre Band besteht aus vier Tieren.", "Hast du als Kind keine Märchen gelesen?"]
        },
        {
          ghost: "Seit 1953 steht eine Statue der Bremer Stadtmusikanten am Marktplatz. Es heißt, ein Wunsch geht in Erfüllung, wenn man die Vorderbeine des Esels berührt. Vielleicht wünschst du dir, zurück in die Zukunft zu kommen? Sieh mal, welches Tier steht auf dem Hund?",
          choices: ["Hahn", "Esel", "Maus", "Katze"],
          hints: ["Die Band besteht aus Esel, Hahn, Hund und Katze. Du solltest erkennen, was auf dem Hund steht."]
        },
        "Übrigens sind Katzen die Lieblingshaustiere der Deutschen, sie sind sehr sauber und gelten als sehr klug. Vielleicht sollten wir mit der Katze reden.",
        "Du hockst dich neben die bronzene Katze. Sie öffnet ein Auge, und eine Stimme, die nicht die des Geistes ist, spricht in deinem Kopf, trocken und ohne Eile:\n\n„Die Glocke, die er will, ist in einer Fata Morgana versteckt, in der Straße der Glocken. Folge den Glocken. Und pass auf, was er dich nehmen lässt. Ich sehe zu.“",
        "Hat sie etwas gesagt? Ich habe nur Schnurren gehört. Katzen. Die Straße der Glocken, sagst du? Böttcherstraße. Glocken. Los."
      ]
    },
    {
      title: "Böttcherstraße",
      label: "Eingang Böttcherstraße (Marktplatzseite)",
      steps: [
        {
          ghost: "Im 21. Jahrhundert ist die Böttcherstraße eine beliebte Touristenattraktion. Im Mittelalter war die Straße sehr wichtig und verband den Marktplatz mit der Weser. Um 1924 wurden zwei alte Speicher zu einem Haus umgebaut, in das wunderschöne Glocken eingebaut sind. Finde diesen Ort. Wie heißt das Haus?",
          choices: ["Haus der Bremer", "Robinson-Crusoe-Haus", "Haus des Glockenspiels", "Paula-Modersohn-Haus"],
          hints: ["Suchen wir den Ort hier in der Böttcherstraße, dann kommt dir die Idee.", "Glocken plus Haus ist im Grunde der Name."]
        },
        "Ja, es hieß Haus des Glockenspiels. Verdammt, sieh nur! Das Haus verwandelt sich! Es sieht aus wie ein Haus aus der Zukunft! Das ist eine Fata Morgana!",
        "Plötzlich erschrecken die Leute um dich herum und laufen davon.",
        {
          ghost: "Die Glocken sind wunderschön! Sie sind aus Porzellan. Wie viele Glocken zählst du?",
          choices: ["20", "30", "36", "40"],
          hints: ["Zähl die Glocken, bevor die Fata Morgana verschwindet!", "Es sind zwischen 20 und 40."]
        },
        {
          ghost: "Sieh nur, die Fata Morgana verschwindet und das Gebäude stürzt ein… Was für eine Verschwendung. Die Glocken fallen herunter, fang eine!",
          choices: ["Weglaufen", "Eine Glocke fangen", "Kopf schützen"],
          hints: ["Keine Zeit verlieren, fang!", "F.A.N.G.E.N.!"]
        },
        "Gut! Das ist sie. Das ist die eine, ich würde sie überall erkennen, ich habe ihren Rand selbst gefeilt. Halt sie fest. Jetzt zurück zum Anfang der Straße!",
        "Die Glocke ist klein und aus Bronze und noch warm in deiner Hand, gar nicht aus Porzellan. Hinter dir ist die Straße wieder still geworden; ein paar Gesichter spähen aus den Türen.",
        "Hol Luft. Seltsam, oder? Eine Fata Morgana, die etwas Echtes zurücklässt. Die Katze sagte Glocken. Ich sage: halt sie fest und geh weiter.",
        "Du gehst zurück zum Anfang der Böttcherstraße und bleibst vor einem goldenen Bild stehen, das am Eingang erscheint.",
        {
          ghost: "Sieh dir das Gold an! Wieder eine Fata Morgana! Das Gold schmilzt! Nimm es! Nimm es, wir können es gebrauchen!",
          choices: ["Liegen lassen", "Das Gold nehmen", "Die Leute fragen"],
          replies: [
            "Ja! Warm, nicht wahr? Denk nicht darüber nach, woher es kommt.",
            "Liegen lassen? Gold! Es läuft die Wand herunter wie Honig und du… na gut. Na gut. Dein Verlust. Meiner auch."
          ],
          hints: ["Gold, nimm das Gold!", "Die Leute helfen dir nicht. Nimm es oder lass es."]
        },
        "Die Leute kommen näher und wollen das Gold. Wir sollten weiter. Die Böttcherstraße hat viele interessante Gebäude, die solltest du dir später ansehen.",
        "Ein grauer Schatten streicht einmal um deine Knöchel. „Domsheide“, sagt die Stimme der Katze in deinem Kopf, und der Schatten ist weg."
      ]
    },
    {
      title: "Domsheide / Die Glocke",
      label: "Domsheide (Die Glocke)",
      steps: [
        "Unterwegs meldet sich die Stimme der Katze noch einmal: Etwas Gefährliches wird passieren, wenn du nicht sehr bald den Weg zurück in die Zukunft findest.",
        {
          ghost: "Die Katze spinnt. Hör nicht auf sie. Warum sind wir hier? Oh, hier ist ein Gebäude, das aussieht wie eine Glocke. Wie heißt es?",
          choices: ["Das Rathaus", "Der Schütting", "Die Glocke", "Die Bürgerschaft"],
          hints: ["Der Name steht am Haus.", "Siehst du die Buchstaben am Gebäude nicht?"]
        },
        {
          ghost: "Seltsam, dass die Katze uns nur zu Orten mit Glocken führt. Dieses Gebäude gehört dem Domstift. Es wurde im 15. Jahrhundert gebaut, im 21. Jahrhundert ist es ein Konzerthaus. Am Eingang gibt es fünf Türen mit fünf Figurenfriesen. Was ist auf dem Fries rechts neben dem mit der Glocke zu sehen?",
          choices: ["Schwert", "Maske", "Glocke", "Leier"],
          hints: ["Das dient zur Verkleidung.", "Man setzt es sich aufs Gesicht."]
        },
        "Masken verbergen Gesichter. Rund um die Domsheide stehen schöne Gebäude wie das Gericht oder die Hauptpost.",
        "Plötzlich rempelt dich jemand an: ein Mann mit Stock und steifem Bein, schneller unterwegs, als ein steifes Bein erlauben sollte. Er ist um die Ecke, bevor du dich umdrehen kannst. Du siehst nach unten. Die Glocke, die du bei dir hattest, ist weg.",
        "Die Glocke! Er hat die GLOCKE genommen! Von allem, was du trägst, die Glocke! Lauf, wir müssen den Dieb kriegen! In den Schnoor!"
      ]
    },
    {
      title: "Lange Wieren / St. Johann",
      label: "Kirche St. Johann (Lange Wieren)",
      steps: [
        {
          ghost: "Okay, wir müssten in der Nähe einer alten Kirche sein, der Dieb muss hier irgendwo stecken. Glocken. Überall Glocken. Sehen wir uns hier um? Wie heißt die Kirche?",
          choices: ["St. Petri", "St. Martini", "St. Johann", "St. Ansgarii"],
          hints: ["Irgendwo hier müsste es stehen… Ich glaube, es fing mit St. J an…"]
        },
        {
          ghost: "Ah ja, St. Johann. Der Bau geht ins 14. Jahrhundert zurück, damals war es ein Kloster. Im 16. Jahrhundert wurde es ein Irrenhaus und im 20. Jahrhundert eine römisch-katholische Pfarrkirche. Wir sind jetzt in einem der ältesten Viertel Bremens. Wie heißt dieses Viertel?",
          choices: ["Viertel", "Schnoor", "Neustadt", "Findorff"],
          hints: ["Sieh auf Straßenschilder oder in Schaufenster.", "Die Passanten kennen den Namen bestimmt."]
        },
        {
          ghost: "Die Gassen und Häuser sind hier sehr eng. Hier wurden Taue und Seile für die Schifffahrt gemacht. Ein Dieb kann sich hier gut verstecken. Hier gab es die erste Fähre, und um 1240 wurde die erste Brücke über den Fluss gebaut. Wie heißt der Fluss?",
          choices: ["Elbe", "Lesum", "Weser", "Wümme"],
          hints: ["Es ist der einzige Fluss, der durch Bremen fließt."]
        },
        "Riechst du das Wasser? Aufregend. Und jetzt das Horn. Ich sagte doch, es wirkt nicht nur auf Schweine. Blas hinein. Los.",
        "Du setzt das Hirtenhorn an die Lippen und bläst. Den Menschen passiert nichts. Aber auf jedem Fensterbrett und jeder Türschwelle des Schnoors erscheinen Katzen, ein Dutzend, zwei Dutzend, und alle drehen den Kopf in dieselbe Richtung: die Gasse hinunter, zum Fluss. Irgendwo dort tippt ein Stock eilig über das Pflaster.",
        "Sag ich doch. Wo so viele Katzen hinsehen, ist die eine Katze, und wo die Katze ist, ist unser Dieb. Folge ihnen.",
        "Riechst du das Wasser? Aufregend. Hätten wir jetzt das Horn, könnte ich… egal. Wir durchsuchen den Schnoor auf die langsame Art. Erst der Dieb."
      ]
    },
    {
      title: "Schnoor-Eingang",
      label: "Eingang zum Schnoor",
      steps: [
        "Halt Ausschau nach dem Dieb. Währenddessen erzähle ich dir mehr über dieses Viertel. Irgendwo hier verkaufen sie ein traditionelles Bremer Winterbrot.",
        {
          ghost: "Wo wir schon hier sind, sollten wir dieses Winterbrot probieren. Es wird immer Anfang Dezember gebacken und reicht bis Ostern. Wie heißt dieses Brot?",
          choices: ["Stuten", "Stollen", "Klaben", "Butterkuchen"],
          hints: ["Der Name steht bestimmt im Schaufenster.", "Der Name fängt mit K an."]
        },
        "Du hast kein Geld aus irgendeinem Jahrhundert. Die Bäckerin hört sich deine Geschichte von einem Geist und einer gestohlenen Glocke an, lacht und gibt dir trotzdem ein Stück Klaben. „Für unterwegs. Du siehst aus, als könntest du es brauchen.“",
        "Almosen. Hm. Mit dem Gold wäre es schneller gegangen.",
        "Du gehst in die Bäckerei und legst Hinrichs Gold auf den Tresen. Die Bäckerin beißt darauf, runzelt die Stirn, zuckt mit den Schultern und gibt dir einen Klaben in Papier.",
        "Siehst du? Gold ist nützlich. Wen kümmert es, woher es kommt.",
        {
          ghost: "Jeder Bremer behauptet, das einzig wahre Rezept für dieses Brot zu haben, aber alle haben dieselbe Tradition. Oh, da! Der Dieb, mit Stock und allem, ist gerade über die Gasse gelaufen und links abgebogen. Dort ist ein Lokal, das nach dem Bremer Bier benannt ist, er könnte da drin sein. Wie heißt das Bier?",
          choices: ["Jever", "Astra", "Beck’s", "Hemelinger"],
          hints: ["Das Logo ist grün und weiß.", "Such ein Logo mit grünem Hintergrund und weißer Schrift."]
        },
        "Ein Kellner in der Tür schüttelt den Kopf, bevor du fragen kannst. „Der Lahme? Ist vorbeigelaufen. Zu den Katzen, wie immer.“",
        "Die Katze. Natürlich. Es war immer die Katze. Oh nein, die Häuser verwandeln sich schon wieder, wir müssen uns beeilen! Die Straße runter, hinterher!"
      ]
    },
    {
      title: "Schnoor – Katzen-Café",
      label: "Katzen-Café, Schnoor",
      steps: [
        {
          ghost: "Katzen… ich rieche Katzen… Was ist hier los? Siehst du ein Schild mit Katzen?",
          choices: ["Ja", "Nein"],
          replies: ["Ich rieche Katzen, es muss hier irgendwo sein.", null],
          hints: ["Ich rieche Katzen, es muss hier irgendwo sein. Such die Hausnummer 38.", "Mehr als eine Katze, gemalt auf ein Schild über einer Tür."]
        },
        {
          ghost: "Ich wusste es, das ist sicher eine Falle. Welches Tier ist zwischen den Katzen?",
          choices: ["Vogel", "Maus", "Fisch", "Hund"],
          hints: ["Es ist klein und mag Käse.", "Die Mörderin Gesche hat ihre Opfer mit einem Gift für dieses Tier getötet."]
        },
        {
          ghost: "Jetzt ergibt alles einen Sinn! Wir sind die Mäuse, mit denen die Katze spielt! Wie heißt das Haus mit den Katzen?",
          choices: ["Café Miau", "Katzen-Café", "Zum Schnurrhaar", "Samtpfote"],
          hints: ["Lies das Schild über der Tür an Schnoor 38. Der Name sagt genau, was du gerochen hast.", "Katzen und ein Ort, an dem man Kaffee trinkt."]
        },
        "An einen Namen wie ‚Katzen-Café‘ kann ich mich aus meiner Zeit nicht erinnern. Dieses Haus ist auch eine Fata Morgana! Sieh nur, die Katze vom Marktplatz. Und der Dieb sitzt direkt daneben, mit unserer Glocke!",
        "Der Mann mit dem Stock sitzt auf der Stufe neben der Katze. Er ist alt, grau im Bart, sieht harmlos aus und ist sehr zufrieden mit sich. Die Katze sieht dich an wie damals auf dem Marktplatz.",
        {
          ghost: "Er gibt ihr die Glocke! Lass mich die Kontrolle über deinen Geist übernehmen, damit ich die Katze mit deinen magischen Gegenständen bekämpfen kann. Gib mir die Kontrolle!",
          choices: ["Ja, übernimm die Kontrolle", "Niemals!", "Hanswurst!"],
          replies: [
            "Danke. Endlich.\n\nDeine Hände bewegen sich ohne dich. Sie drängen sich an der Katze vorbei, nehmen dem alten Mann die Glocke ab und läuten sie. Der Klang ist klein und falsch. Die Gasse wird weiß, dann grau, dann nichts, und von sehr weit weg hörst du deine eigene Stimme zu einem Fremden sagen: Hallo? Kannst du mich hören?",
            "Niemals? NIEMALS? Nach allem, was ich für dich getan habe?",
            "HANSWURST? Ich gieße Glocken, ich bin seit sechshundert Jahren tot, und du nennst mich HANSWURST?!"
          ],
          cards: ["Hallo? Kannst du mich hören?", null, null],
          hints: ["Komm schon, mit ihrer Kraft kann ich uns retten! Ehrlich!", "Willst du wirklich einem Geist deinen Kopf überlassen? Nenn ihn lieber beim Namen. Einen deftigen. Irgendwas mit Wurst."]
        },
        "Der Geist schreit. Es ist der Schrei vom Anfang, der, bei dem alles schwarz wird, und er kommt aus deinem eigenen Kopf.",
        "Du setzt das Horn an die Lippen und bläst. Der Schrei bricht ab wie eine zugeschlagene Tür. Irgendwo im Dunkel hinter deinen Augen hält sich etwas Kleines, Wütendes die Ohren zu.",
        "Schon gut. SCHON GUT. Ich habe ja gesagt, es wirkt nicht nur auf Schweine.",
        "Deine Knie geben nach. Das Pflaster kommt dir entgegen. Der Schrei geht weiter und weiter, und du begreifst, dass er nicht aufhören muss, dass er das sechshundert Jahre lang machen kann, wenn er will. Dann jault die Katze, ein einziger langer Ton, der durch den Schrei schneidet wie Draht durch Ton, und der Schrei franst aus, wird dünn und ist weg. Du bist auf allen vieren im Schnoor, mit Blutgeschmack im Mund, wo du dir auf die Zunge gebissen hast. Die Katze leckt sich eine Pfote.",
        "…Schon gut. Schon gut. Das war unnötig. Von der Katze, meine ich.",
        "Die Katze spricht, und diesmal scheint der alte Mann sie auch zu hören.\n\n„Jetzt weißt du, was er ist. Hinrich, Lehrling, Dieb. Er hat die Bürgerglocke aus Klinghes Gießerei genommen und versteckt, und sie haben ihn gehängt, bevor er sagen konnte, wo. Ich habe sie seitdem in einer Fata Morgana aufbewahrt, außerhalb seiner Reichweite. Sie muss in einer ehrlichen lebenden Hand läuten, hier, wo die Reepschläger des Schnoors sie einst läuteten, um vor Dieben zu warnen. Dann kann er ruhen, und du kannst nach Hause.“",
        "Du siehst den Mann mit dem Stock an. „Heini“, sagt die Katze. „Heini Holtenbeen. Wohnte in der Nummer 8, humpelte sein ganzes Leben durch dieses Viertel und hat nie etwas gestohlen außer einem Lachen. Die Stadt behält ihre nützlichen Toten. Er macht meine Botengänge. Und er hat immer Hunger.“",
        "Heini hält dir die Glocke mit einer Hand hin. Die andere ist offen, Handfläche nach oben. Du hast nichts, was du hineinlegen könntest. Er seufzt und legt dir die Glocke trotzdem in die Hand. „Nächstes Mal“, sagt er, „bring Klaben mit.“",
        "Heini hält dir die Glocke mit einer Hand hin. Die andere ist offen, Handfläche nach oben, und seine Augen hängen an dem Papierpäckchen in deiner Tasche. Du gibst ihm den Klaben. Er beißt hinein, schließt die Augen und legt dir die Glocke in die Hand.",
        "Die Katze sieht dich lange an. „Zweimal hat er dir gesagt, nimm, was dir nicht gehört. Zweimal hast du es nicht getan. Ein ehrlicher Mensch. Selten. Läute sie.“",
        "Die Katze sieht dich lange an. „Das Horn hast du genommen, als er es sagte. Das Gold hast du liegen lassen. Ein halber Dieb. Damit kann Bremen leben. Läute sie.“",
        "Die Katze sieht dich lange an. „Das Horn hast du liegen lassen, das Gold hast du genommen, als er es sagte. Ein halber Dieb. Damit kann Bremen leben. Das Gold war übrigens Fata-Morgana-Gold. Morgen früh liegt ein Stück Kohle in der Kasse der Bäckerin. Läute sie.“",
        "Die Katze sieht dich lange an. „Horn und Gold. Beide Male, als er nimm sagte, hast du genommen. Das Gold war übrigens Fata-Morgana-Gold; morgen früh liegt ein Stück Kohle in der Kasse der Bäckerin. Läute sie trotzdem. Und dann geh, bevor ich es mir anders überlege.“",
        "„Hanswurst“, fügt die Katze hinzu, „war gut gewählt.“",
        {
          ghost: "…Na los. Läute sie. Ich würde jetzt gern aufhören.",
          choices: ["Die Glocke läuten", "Behalten"],
          replies: ["Bitte.", null],
          hints: ["Es ist eine Glocke. Mit einer Glocke macht man genau eine Sache."]
        },
        "Du läutest die Glocke. Der Klang ist klein und klar und vollkommen richtig. Das Katzen-Café, die Gasse, der Himmel darüber kräuseln sich wie Wasser und werden wieder still, und der alte Mann und die Katze sind nicht mehr da.",
        "Danke. Ich meine es ernst, ausnahmsweise. Ich habe sie genommen. Ich wollte sie verkaufen. Ich war sechzehn und dumm, und dann war ich tot, und sechshundert Jahre sind eine lange Zeit, um es zu bereuen.\n\nLeb wohl, Mensch aus der Zukunft. Spuck für mich auf einen Stein.",
        "Die Stimme ist weg. Du wachst auf dem Pflaster vor Schnoor 38 auf, heute, das Handy in der Hand, Bäckereiduft in der Luft. Ein paar Schritte weiter, beim Concordenhaus, grinst ein bronzener Mann mit Stock ins Leere. In deiner Tasche liegt eine kleine Bronzeglocke, die heute Morgen noch nicht da war."
      ]
    }
  ]
};

import type { TargetLanguage } from "../components/targetLanguages";

export type TranslationRecord = {
  uid: number;
  sentence: string;
  translation: string;
  targetLanguage: TargetLanguage;
  sessionID: string;
  vocabItems: {
    word: string;
    lemma: string;
    pos: "NOUN" | "VERB" | "ADJ" | "ADV" | "ADP" | "SCONJ";
  }[];
};

const translationData: TranslationRecord[] = [
  {
    uid: 0,
    sentence:
      "Reading for even a few minutes each day helps improve vocabulary, focus, and long-term comprehension.",
    translation:
      "Leer incluso unos pocos minutos cada día ayuda a mejorar el vocabulario, la concentración y la comprensión a largo plazo.",
    targetLanguage: "spanish",
    sessionID: "session-8f3a",
    vocabItems: [
      { word: "Reading", lemma: "read", pos: "VERB" },
      { word: "for", lemma: "for", pos: "ADP" },
      { word: "even", lemma: "even", pos: "ADV" },
      { word: "few", lemma: "few", pos: "ADJ" },
      { word: "minutes", lemma: "minute", pos: "NOUN" },
      { word: "day", lemma: "day", pos: "NOUN" },
      { word: "helps", lemma: "help", pos: "VERB" },
      { word: "improve", lemma: "improve", pos: "VERB" },
      { word: "vocabulary", lemma: "vocabulary", pos: "NOUN" },
      { word: "focus", lemma: "focus", pos: "NOUN" },
      { word: "long-term", lemma: "long-term", pos: "ADJ" },
      { word: "comprehension", lemma: "comprehension", pos: "NOUN" },
    ],
  },
  {
    uid: 1,
    sentence: "It also builds a steady habit of reflection and learning.",
    translation:
      "También construye un hábito constante de reflexión y aprendizaje.",
    targetLanguage: "spanish",
    sessionID: "session-8f3a",
    vocabItems: [
      { word: "also", lemma: "also", pos: "ADV" },
      { word: "builds", lemma: "build", pos: "VERB" },
      { word: "steady", lemma: "steady", pos: "ADJ" },
      { word: "habit", lemma: "habit", pos: "NOUN" },
      { word: "of", lemma: "of", pos: "ADP" },
      { word: "reflection", lemma: "reflection", pos: "NOUN" },
      { word: "learning", lemma: "learning", pos: "NOUN" },
    ],
  },
  {
    uid: 2,
    sentence:
      "A balanced study routine should include short breaks and clear goals for each session.",
    translation:
      "Une routine d'étude équilibrée devrait inclure de courtes pauses et des objectifs clairs pour chaque séance.",
    targetLanguage: "french",
    sessionID: "session-b72c",
    vocabItems: [
      { word: "balanced", lemma: "balanced", pos: "ADJ" },
      { word: "study", lemma: "study", pos: "NOUN" },
      { word: "routine", lemma: "routine", pos: "NOUN" },
      { word: "include", lemma: "include", pos: "VERB" },
      { word: "short", lemma: "short", pos: "ADJ" },
      { word: "breaks", lemma: "break", pos: "NOUN" },
      { word: "clear", lemma: "clear", pos: "ADJ" },
      { word: "goals", lemma: "goal", pos: "NOUN" },
      { word: "for", lemma: "for", pos: "ADP" },
      { word: "session", lemma: "session", pos: "NOUN" },
    ],
  },
  {
    uid: 3,
    sentence:
      "Enough sleep is also important for memory retention and concentration.",
    translation:
      "Un sommeil suffisant est également important pour la rétention de la mémoire et la concentration.",
    targetLanguage: "french",
    sessionID: "session-b72c",
    vocabItems: [
      { word: "sleep", lemma: "sleep", pos: "NOUN" },
      { word: "also", lemma: "also", pos: "ADV" },
      { word: "important", lemma: "important", pos: "ADJ" },
      { word: "for", lemma: "for", pos: "ADP" },
      { word: "memory", lemma: "memory", pos: "NOUN" },
      { word: "retention", lemma: "retention", pos: "NOUN" },
      { word: "concentration", lemma: "concentration", pos: "NOUN" },
    ],
  },
  {
    uid: 4,
    sentence:
      "The wife of a man who died saving two of their children from a rip current is remembering her husband one week after the tragic accident.",
    translation:
      "一名男子為了從離岸流中救出他們的兩個孩子而喪命，他的妻子在這起悲劇發生一週後，仍深深懷念著丈夫。",
    targetLanguage: "chinese",
    sessionID: "session-a94d",
    vocabItems: [
      { word: "wife", lemma: "wife", pos: "NOUN" },
      { word: "man", lemma: "man", pos: "NOUN" },
      { word: "who", lemma: "who", pos: "SCONJ" },
      { word: "died", lemma: "die", pos: "VERB" },
      { word: "saving", lemma: "save", pos: "VERB" },
      { word: "children", lemma: "child", pos: "NOUN" },
      { word: "from", lemma: "from", pos: "ADP" },
      { word: "current", lemma: "current", pos: "NOUN" },
      { word: "remembering", lemma: "remember", pos: "VERB" },
      { word: "one", lemma: "one", pos: "NOUN" },
      { word: "after", lemma: "after", pos: "ADP" },
      { word: "tragic", lemma: "tragic", pos: "ADJ" },
      { word: "accident", lemma: "accident", pos: "NOUN" },
    ],
  },
  {
    uid: 5,
    sentence:
      "Emily Jennings shared a statement on Wednesday, following her husband Ryan Jennings' death on April 1.",
    translation:
      "Emily Jennings 於週三發表了一份聲明，當時距離她丈夫 Ryan Jennings 在 4 月 1 日過世後不久。",
    targetLanguage: "chinese",
    sessionID: "session-a94d",
    vocabItems: [
      { word: "shared", lemma: "share", pos: "VERB" },
      { word: "statement", lemma: "statement", pos: "NOUN" },
      { word: "on", lemma: "on", pos: "ADP" },
      { word: "Wednesday", lemma: "Wednesday", pos: "NOUN" },
      { word: "following", lemma: "follow", pos: "VERB" },
      { word: "husband", lemma: "husband", pos: "NOUN" },
      { word: "death", lemma: "death", pos: "NOUN" },
      { word: "on", lemma: "on", pos: "ADP" },
    ],
  },
  {
    uid: 6,
    sentence:
      "Ryan Jennings died while saving his two children, who were struggling in the water off of Juno Beach in Florida, according to a report from the Juno Beach Police Department.",
    translation:
      "根據朱諾海灘警察局的一份報告，Ryan Jennings 在拯救他兩個於佛羅里達州朱諾海灘外海水中掙扎的孩子時身亡。",
    targetLanguage: "chinese",
    sessionID: "session-a94d",
    vocabItems: [
      { word: "died", lemma: "die", pos: "VERB" },
      { word: "while", lemma: "while", pos: "SCONJ" },
      { word: "saving", lemma: "save", pos: "VERB" },
      { word: "children", lemma: "child", pos: "NOUN" },
      { word: "who", lemma: "who", pos: "SCONJ" },
      { word: "struggling", lemma: "struggle", pos: "VERB" },
      { word: "in", lemma: "in", pos: "ADP" },
      { word: "water", lemma: "water", pos: "NOUN" },
      { word: "off", lemma: "off", pos: "ADP" },
      { word: "of", lemma: "of", pos: "ADP" },
      { word: "Beach", lemma: "Beach", pos: "NOUN" },
      { word: "in", lemma: "in", pos: "ADP" },
      { word: "according", lemma: "accord", pos: "VERB" },
      { word: "to", lemma: "to", pos: "ADP" },
      { word: "report", lemma: "report", pos: "NOUN" },
      { word: "from", lemma: "from", pos: "ADP" },
      { word: "Police", lemma: "Police", pos: "NOUN" },
      { word: "Department", lemma: "Department", pos: "NOUN" },
    ],
  },
  {
    uid: 7,
    sentence:
      'In a separate statement, Palm Beach County Fire Rescue said Ocean Rescue lifeguards at the beach the day of the incident "initiated a water rescue" and were able to assist in bringing four individuals to shore, three of whom were transported to a local hospital.',
    translation:
      "In einer separaten Stellungnahme erklärte Palm Beach County Fire Rescue, dass die Rettungsschwimmer von Ocean Rescue am Strand am Tag des Vorfalls „eine Wasserrettung eingeleitet“ hätten und dabei helfen konnten, vier Personen ans Ufer zu bringen, von denen drei in ein örtliches Krankenhaus gebracht wurden.",
    targetLanguage: "german",
    sessionID: "session-c83f",
    vocabItems: [
      { word: "separate", lemma: "separate", pos: "ADJ" },
      { word: "statement", lemma: "statement", pos: "NOUN" },
      { word: "said", lemma: "say", pos: "VERB" },
      { word: "lifeguards", lemma: "lifeguard", pos: "NOUN" },
      { word: "at", lemma: "at", pos: "ADP" },
      { word: "beach", lemma: "beach", pos: "NOUN" },
      { word: "day", lemma: "day", pos: "NOUN" },
      { word: "of", lemma: "of", pos: "ADP" },
      { word: "incident", lemma: "incident", pos: "NOUN" },
      { word: "initiated", lemma: "initiate", pos: "VERB" },
      { word: "water", lemma: "water", pos: "NOUN" },
      { word: "rescue", lemma: "rescue", pos: "NOUN" },
      { word: "able", lemma: "able", pos: "ADJ" },
      { word: "assist", lemma: "assist", pos: "VERB" },
      { word: "in", lemma: "in", pos: "ADP" },
      { word: "bringing", lemma: "bring", pos: "VERB" },
      { word: "individuals", lemma: "individual", pos: "NOUN" },
      { word: "to", lemma: "to", pos: "ADP" },
      { word: "shore", lemma: "shore", pos: "NOUN" },
      { word: "whom", lemma: "whom", pos: "SCONJ" },
      { word: "were", lemma: "be", pos: "VERB" },
      { word: "transported", lemma: "transport", pos: "VERB" },
      { word: "to", lemma: "to", pos: "ADP" },
      { word: "local", lemma: "local", pos: "ADJ" },
      { word: "hospital", lemma: "hospital", pos: "NOUN" },
    ],
  },
  {
    uid: 8,
    sentence:
      'The statement noted the group "was not swimming in a guarded area" at the time of the rescue, and that "conditions, including low tide and an onshore (east) wind, were consistent with the potential for rip current activity."',
    translation:
      "In der Stellungnahme wurde darauf hingewiesen, dass die Gruppe zum Zeitpunkt der Rettung „nicht in einem bewachten Bereich schwamm“ und dass die „Bedingungen, einschließlich Niedrigwasser und eines auflandigen (östlichen) Windes, mit dem möglichen Auftreten von Rip-Strömungen übereinstimmten“.",
    targetLanguage: "german",
    sessionID: "session-c83f",
    vocabItems: [
      { word: "statement", lemma: "statement", pos: "NOUN" },
      { word: "noted", lemma: "note", pos: "VERB" },
      { word: "group", lemma: "group", pos: "NOUN" },
      { word: "was", lemma: "be", pos: "VERB" },
      { word: "not", lemma: "not", pos: "ADV" },
      { word: "swimming", lemma: "swim", pos: "VERB" },
      { word: "in", lemma: "in", pos: "ADP" },
      { word: "guarded", lemma: "guarded", pos: "ADJ" },
      { word: "area", lemma: "area", pos: "NOUN" },
      { word: "at", lemma: "at", pos: "ADP" },
      { word: "time", lemma: "time", pos: "NOUN" },
      { word: "of", lemma: "of", pos: "ADP" },
      { word: "rescue", lemma: "rescue", pos: "NOUN" },
      { word: "and", lemma: "and", pos: "SCONJ" },
      { word: "that", lemma: "that", pos: "SCONJ" },
      { word: "conditions", lemma: "condition", pos: "NOUN" },
      { word: "including", lemma: "include", pos: "VERB" },
      { word: "low", lemma: "low", pos: "ADJ" },
      { word: "tide", lemma: "tide", pos: "NOUN" },
      { word: "onshore", lemma: "onshore", pos: "ADJ" },
      { word: "wind", lemma: "wind", pos: "NOUN" },
      { word: "were", lemma: "be", pos: "VERB" },
      { word: "consistent", lemma: "consistent", pos: "ADJ" },
      { word: "with", lemma: "with", pos: "ADP" },
      { word: "potential", lemma: "potential", pos: "NOUN" },
      { word: "for", lemma: "for", pos: "ADP" },
      { word: "current", lemma: "current", pos: "NOUN" },
      { word: "activity", lemma: "activity", pos: "NOUN" },
    ],
  },
  {
    uid: 9,
    sentence:
      '"We spent our days walking the beach, grabbing coffee downtown, and appreciating the little moments by the fireplace," she wrote.',
    translation:
      '"Passávamos nossos dias caminhando pela praia, tomando café no centro e apreciando os pequenos momentos perto da lareira", escreveu ela.',
    targetLanguage: "portuguese",
    sessionID: "session-d91e",
    vocabItems: [
      { word: "spent", lemma: "spend", pos: "VERB" },
      { word: "days", lemma: "day", pos: "NOUN" },
      { word: "walking", lemma: "walk", pos: "VERB" },
      { word: "beach", lemma: "beach", pos: "NOUN" },
      { word: "grabbing", lemma: "grab", pos: "VERB" },
      { word: "coffee", lemma: "coffee", pos: "NOUN" },
      { word: "downtown", lemma: "downtown", pos: "ADV" },
      { word: "appreciating", lemma: "appreciate", pos: "VERB" },
      { word: "little", lemma: "little", pos: "ADJ" },
      { word: "moments", lemma: "moment", pos: "NOUN" },
      { word: "by", lemma: "by", pos: "ADP" },
      { word: "fireplace", lemma: "fireplace", pos: "NOUN" },
      { word: "wrote", lemma: "write", pos: "VERB" },
    ],
  },
  {
    uid: 10,
    sentence:
      '"Three months passed while I looked for apartments -- but what really happened in that time is that we fell madly in love and became a family."',
    translation:
      '"Três meses se passaram enquanto eu procurava apartamentos — mas o que realmente aconteceu nesse período foi que nos apaixonamos loucamente e nos tornamos uma família."',
    targetLanguage: "portuguese",
    sessionID: "session-d91e",
    vocabItems: [
      { word: "months", lemma: "month", pos: "NOUN" },
      { word: "passed", lemma: "pass", pos: "VERB" },
      { word: "while", lemma: "while", pos: "SCONJ" },
      { word: "looked", lemma: "look", pos: "VERB" },
      { word: "for", lemma: "for", pos: "ADP" },
      { word: "apartments", lemma: "apartment", pos: "NOUN" },
      { word: "really", lemma: "really", pos: "ADV" },
      { word: "happened", lemma: "happen", pos: "VERB" },
      { word: "in", lemma: "in", pos: "ADP" },
      { word: "time", lemma: "time", pos: "NOUN" },
      { word: "that", lemma: "that", pos: "SCONJ" },
      { word: "fell", lemma: "fall", pos: "VERB" },
      { word: "madly", lemma: "madly", pos: "ADV" },
      { word: "love", lemma: "love", pos: "NOUN" },
      { word: "became", lemma: "become", pos: "VERB" },
      { word: "family", lemma: "family", pos: "NOUN" },
    ],
  },
  {
    uid: 11,
    sentence:
      "Eventually, she said, the couple married and moved to Maine, welcoming two more children into their family and learning recently that they were expecting again.",
    translation:
      "Eventualmente, disse ela, o casal se casou e se mudou para Maine, acolhendo mais dois filhos na família e descobrindo recentemente que estavam esperando novamente.",
    targetLanguage: "portuguese",
    sessionID: "session-d91e",
    vocabItems: [
      { word: "eventually", lemma: "eventually", pos: "ADV" },
      { word: "said", lemma: "say", pos: "VERB" },
      { word: "couple", lemma: "couple", pos: "NOUN" },
      { word: "married", lemma: "marry", pos: "VERB" },
      { word: "moved", lemma: "move", pos: "VERB" },
      { word: "to", lemma: "to", pos: "ADP" },
      { word: "welcoming", lemma: "welcome", pos: "VERB" },
      { word: "children", lemma: "child", pos: "NOUN" },
      { word: "into", lemma: "into", pos: "ADP" },
      { word: "family", lemma: "family", pos: "NOUN" },
      { word: "learning", lemma: "learn", pos: "VERB" },
      { word: "recently", lemma: "recently", pos: "ADV" },
      { word: "that", lemma: "that", pos: "SCONJ" },
      { word: "were", lemma: "be", pos: "VERB" },
      { word: "expecting", lemma: "expect", pos: "VERB" },
    ],
  },
  {
    uid: 12,
    sentence:
      "Ryan Jennings' 'greatest love' was his family, Emily Jennings wrote.",
    translation:
      '"O maior amor de Ryan Jennings era sua família", escreveu Emily Jennings.',
    targetLanguage: "portuguese",
    sessionID: "session-d91e",
    vocabItems: [
      { word: "greatest", lemma: "great", pos: "ADJ" },
      { word: "love", lemma: "love", pos: "NOUN" },
      { word: "was", lemma: "be", pos: "VERB" },
      { word: "family", lemma: "family", pos: "NOUN" },
      { word: "wrote", lemma: "write", pos: "VERB" },
    ],
  },
  {
    uid: 13,
    sentence: '"He was always so proud of us," she said.',
    translation: '"Ele sempre teve muito orgulho de nós", disse ela.',
    targetLanguage: "portuguese",
    sessionID: "session-d91e",
    vocabItems: [
      { word: "was", lemma: "be", pos: "VERB" },
      { word: "always", lemma: "always", pos: "ADV" },
      { word: "so", lemma: "so", pos: "ADV" },
      { word: "proud", lemma: "proud", pos: "ADJ" },
      { word: "of", lemma: "of", pos: "ADP" },
      { word: "said", lemma: "say", pos: "VERB" },
    ],
  },
];

export default translationData;

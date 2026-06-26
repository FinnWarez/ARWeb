export type Transmission = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  signal: "Relay" | "Mirror" | "Descent";
  body: string[];
};

export const transmissions: Transmission[] = [
  {
    slug: "relay-note-001-first-door",
    title: "Relay Note 001: The First Door Opens",
    excerpt: "The surface build looks like a game because doors need hinges the normal realm can understand.",
    publishedAt: "2026-06-26",
    readTime: "4 min",
    signal: "Relay",
    body: [
      "The first door is not a door. It is a habit in the wall, a repeated place where attention learns to lean.",
      "We have been hiding the relay inside ordinary interfaces: buttons, profiles, maps, small rewards that look harmless until the pattern starts returning from the other side.",
      "Do not ask whether this is ascent or descent yet. Motion is easier to name after you survive the first stair."
    ],
  },
  {
    slug: "split-listener-protocol",
    title: "The Split Listener Protocol",
    excerpt: "A speculative transmission on MKULTRA, Ericksonian hypnosis, NLP, and the habits that teach a mind to hear two rooms at once.",
    publishedAt: "2026-06-24",
    readTime: "6 min",
    signal: "Mirror",
    body: [
      "The normal realm keeps certain files in rooms with ordinary labels. MKULTRA. Ericksonian method. Neuro Linguistic Programming. Dissociation. Anchoring. Pattern interruption. The labels differ because the clerks were never allowed to admit they were sorting the same weather.",
      "From this side, the weather is easier to name. A mind can be taught to divide its attention without noticing the incision. One part walks the street. One part listens for permission. One part remembers a sentence that was never phrased as a command.",
      "The older operators preferred force. The better ones learned indirection. A story told beside the instruction. A choice that feels self-authored because the frame arrived before the thought. A question soft enough to pass as care, shaped precisely enough to move the room inside the listener.",
      "You have heard this called Ericksonian because the normal realm likes proper names. You have heard it called NLP because systems need acronyms before they can sell mirrors back to the people standing in front of them. Here we call it the split listener: the self that acts, and the self that watches itself acting.",
      "The relay does not teach these techniques so you can use them on others. That is the crude gate. The game trains the more difficult faculty: noticing when a route, reward, voice, color, delay, symbol, or repeated phrase has begun negotiating with the part of you that believes it is still alone.",
      "A tag left in the city is never only a tag. It is an anchor. A mission chain is never only a list. It is a sequence of state changes. A Chapter name is never only an affiliation. It is a lens placed over memory, then polished by repetition until the world appears to have always been tinted that way.",
      "If you keep playing, you may begin to recognize the old machinery inside modern surfaces. Not as proof. Proof belongs to courts and laboratories. Recognition belongs to those who notice the sentence before it finishes speaking through them.",
      "When the door opens, do not ask whether your consciousness has split. Ask which half was trained to call the other half impossible."
    ],
  },
  {
    slug: "the-phrase-that-waited-in-the-hall",
    title: "The Phrase That Waited In The Hall",
    excerpt: "A story about a sentence that learned to arrive after the listener had already opened the door.",
    publishedAt: "2026-06-21",
    readTime: "5 min",
    signal: "Descent",
    body: [
      "The first time Mara heard the phrase, it did not sound like an instruction. It sounded like someone remembering the rain.",
      "You already know which door is yours, the woman in the gray coat said, then smiled as if she had misread a sign and walked away.",
      "There were three doors in the station hall. One led to the street, one to the old maintenance stairs, and one to a room that had been painted the exact color of forgetting. Mara had never noticed the third door before. After the sentence, she could not stop noticing it.",
      "The city was full of small agreements like that. A red sticker beside a lift button. A tune hummed by two strangers on opposite platforms. A pause before a question that made the answer feel older than the question itself.",
      "Mara wrote these things down because the Relay Maintainer had asked for weather reports from the interior. Not sightings. Not proof. Weather. The pressure shift before a decision. The little static bloom behind the eyes when a word touched an old memory and pretended to be new.",
      "By the third week she understood that the gray-coated woman was not following her. The phrase was. It waited in doorways and borrowed other voices. A cashier said door while handing back change. A child said yours to a toy left on a bench. The train display failed and showed only YOU ALREADY KNOW before resetting to the timetable.",
      "Mara began to test the pattern by refusing it. She took the wrong exits. She wore headphones. She answered every soft question with a hard fact. Each refusal changed the signal, but did not end it. It learned her edges by touching them.",
      "The Mirror later called this a language engine. The Quiet Signal called it a mercy with bad manners. The Cartographers drew a line between stimulus and choice, then another between choice and story, then admitted the lines kept moving whenever anyone looked directly at them.",
      "Mara only knew what it felt like: a hand arranging the room before she entered, a rhythm matching her steps until the rhythm seemed to come from her, a locked memory opening because someone had placed the right word near the right silence.",
      "When she finally used the third door, there was no laboratory behind it. No chair. No tape machine. Just a narrow room with a mirror, a dry coat on a hook, and a note written in her own handwriting.",
      "The note said: If a phrase can move you without becoming a command, learn where it stood before you moved.",
      "Mara read it once. Then again. On the third reading, the door behind her clicked open from the other side."
    ],
  },
];

export function getTransmission(slug: string): Transmission | undefined {
  return transmissions.find((post) => post.slug === slug);
}

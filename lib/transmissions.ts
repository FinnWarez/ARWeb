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
    slug: "ascent-descent-same-motion",
    title: "On Ascent, Descent, And Signals That Arrive Backwards",
    excerpt: "The old mistake is thinking up and down are moral directions.",
    publishedAt: "2026-06-21",
    readTime: "3 min",
    signal: "Descent",
    body: [
      "A signal can fall into you and still lift something out.",
      "The Chapters disagree about what this means. The Choir hears a rising voice. The Cartographers mark an incline. The Quiet Signal removes the axis and waits.",
      "The Relay Maintainer only records the symptom: some players climb toward the Mirror by descending into the city they already knew."
    ],
  },
];

export function getTransmission(slug: string): Transmission | undefined {
  return transmissions.find((post) => post.slug === slug);
}

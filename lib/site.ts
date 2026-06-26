export const siteConfig = {
  name: "Ascent",
  title: "Ascent | Mirror Layer Transmission",
  description:
    "A location-aware AR signal, chapter mission, and mirror-layer transmission system for players who notice the city answering back.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ascent.example",
  cognitoHostedUiUrl: process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI_URL || "",
  cognitoDomain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "",
  cognitoUserPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
  appDownloadUrl: process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL || "/beta",
  accessTokenStorageKey: process.env.NEXT_PUBLIC_ASCENT_ACCESS_TOKEN_STORAGE_KEY || "ascent.accessToken",
  idTokenStorageKey: process.env.NEXT_PUBLIC_ASCENT_ID_TOKEN_STORAGE_KEY || "ascent.idToken",
  tokenExpiryStorageKey: process.env.NEXT_PUBLIC_ASCENT_TOKEN_EXPIRY_STORAGE_KEY || "ascent.tokenExpiresAt",
  pkceVerifierStorageKey: process.env.NEXT_PUBLIC_ASCENT_PKCE_VERIFIER_STORAGE_KEY || "ascent.pkceVerifier",
  oauthStateStorageKey: process.env.NEXT_PUBLIC_ASCENT_OAUTH_STATE_STORAGE_KEY || "ascent.oauthState",
};

export const creditTiers = [
  {
    sku: "open_signal_free",
    name: "Open Signal",
    price: "Free",
    credits: 0,
    object: "Open Signal Mark",
    body: "A first mark in the public channel. It proves only that you heard the knock.",
    cta: "Open the mark",
  },
  {
    sku: "first_echo_5",
    name: "First Echo",
    price: "$5",
    credits: 500,
    object: "First Echo Token",
    body: "Small enough to pass unnoticed. Loud enough to return when the room changes shape.",
    cta: "Hold the echo",
  },
  {
    sku: "relay_mark_50",
    name: "Relay Mark",
    price: "$50",
    credits: 5500,
    object: "Relay Prism",
    body: "The signal begins to refract. One path climbs. One path descends. Both leave a trace.",
    cta: "Join the relay",
  },
  {
    sku: "mirror_seal_250",
    name: "Mirror Seal",
    price: "$250",
    credits: 30000,
    object: "Mirror Seal",
    body: "A heavier instrument for those who keep finding the same door from different sides.",
    cta: "Seal the passage",
  },
] as const;

export const generatedAssets = [
  {
    file: "/images/generated/mirror-city-hero.png",
    prompt:
      "Mirror-city transmission hero: fictional reflective urban street, AR signal traces, subtle red/glass/static accents, no text, no real landmarks, no identifiable people.",
  },
  {
    file: "/images/generated/tier-artifacts.png",
    prompt:
      "Four symbolic tier artifacts: open signal mark, first echo token, relay prism, mirror seal, premium glass/metal render, no text or real symbols.",
  },
  {
    file: "/images/generated/transmission-header.png",
    prompt:
      "Development-transmission header: reflected workstation, abstract city-map lines, mirrored doorway, no readable text, no logos, no people.",
  },
] as const;

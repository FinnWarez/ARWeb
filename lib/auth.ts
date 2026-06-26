import { siteConfig } from "@/lib/site";

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomBase64Url(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function sha256Base64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return base64UrlEncode(new Uint8Array(digest));
}

function cognitoBaseUrl() {
  const domain = siteConfig.cognitoDomain || siteConfig.cognitoHostedUiUrl;
  if (!domain) return "";
  const withoutPath = domain.replace(/\/oauth2\/.*$/, "").replace(/\/$/, "");
  return withoutPath.startsWith("https://") ? withoutPath : `https://${withoutPath}`;
}

export function hasAuthConfig() {
  return Boolean(cognitoBaseUrl() && siteConfig.cognitoUserPoolClientId);
}

async function beginCognitoAuth(entryPath: "/oauth2/authorize" | "/signup") {
  const baseUrl = cognitoBaseUrl();
  if (!baseUrl || !siteConfig.cognitoUserPoolClientId) {
    throw new Error("Account relay is not configured yet.");
  }

  const verifier = randomBase64Url(64);
  const challenge = await sha256Base64Url(verifier);
  const state = randomBase64Url(32);
  const redirectUri = `${window.location.origin}/auth/callback`;
  window.localStorage.setItem(siteConfig.pkceVerifierStorageKey, verifier);
  window.localStorage.setItem(siteConfig.oauthStateStorageKey, state);

  const params = new URLSearchParams({
    client_id: siteConfig.cognitoUserPoolClientId,
    response_type: "code",
    scope: "openid email profile",
    redirect_uri: redirectUri,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
  });
  window.location.href = `${baseUrl}${entryPath}?${params.toString()}`;
}

export async function beginCognitoSignIn() {
  await beginCognitoAuth("/oauth2/authorize");
}

export async function beginCognitoRegistration() {
  await beginCognitoAuth("/signup");
}

export function clearStoredAuth() {
  window.localStorage.removeItem(siteConfig.accessTokenStorageKey);
  window.localStorage.removeItem(siteConfig.idTokenStorageKey);
  window.localStorage.removeItem(siteConfig.tokenExpiryStorageKey);
  window.localStorage.removeItem(siteConfig.pkceVerifierStorageKey);
  window.localStorage.removeItem(siteConfig.oauthStateStorageKey);
}

export function hasStoredAccessToken() {
  const token = window.localStorage.getItem(siteConfig.accessTokenStorageKey);
  const expiresAt = Number(window.localStorage.getItem(siteConfig.tokenExpiryStorageKey) ?? "0");
  return Boolean(token && (!expiresAt || expiresAt > Date.now()));
}

export function beginCognitoSignOut() {
  const baseUrl = cognitoBaseUrl();
  clearStoredAuth();
  if (!baseUrl || !siteConfig.cognitoUserPoolClientId) return;

  const params = new URLSearchParams({
    client_id: siteConfig.cognitoUserPoolClientId,
    logout_uri: `${window.location.origin}/account`,
  });
  window.location.href = `${baseUrl}/logout?${params.toString()}`;
}

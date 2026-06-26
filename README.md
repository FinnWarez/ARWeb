# ARWeb

Public transmission site for Ascent.

## Local Development

```bash
npm install
npm run dev
```

The website can render without backend secrets. Public form and donation routes proxy to `ASCENT_WEBSITE_API_URL` when configured and return a clear unavailable response otherwise. Credit checkout uses the signed-in Cognito/AppSync path through an HttpOnly same-site session cookie created by the Cognito PKCE account relay.

## Environment

- `NEXT_PUBLIC_SITE_URL`: canonical public site URL.
- `NEXT_PUBLIC_COGNITO_DOMAIN`: Cognito Hosted UI base URL for the same Ascent account used by Android.
- `NEXT_PUBLIC_COGNITO_HOSTED_UI_URL`: optional legacy Hosted UI entrypoint; `NEXT_PUBLIC_COGNITO_DOMAIN` is preferred.
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`: public Cognito website client ID used for authorization-code + PKCE sign-in.
- `NEXT_PUBLIC_APP_DOWNLOAD_URL`: beta/app download destination.
- `NEXT_PUBLIC_ASCENT_PKCE_VERIFIER_STORAGE_KEY`: session storage key for the transient PKCE verifier.
- `NEXT_PUBLIC_ASCENT_OAUTH_STATE_STORAGE_KEY`: session storage key for the transient OAuth state value.
- `ASCENT_ACCESS_TOKEN_COOKIE_NAME`: optional server-side name for the HttpOnly access-token cookie.
- `ASCENT_WEBSITE_API_URL`: server-side Ascent backend website/payment API base URL.
- `NEXT_PUBLIC_ASCENT_WEBSITE_API_URL`: non-secret fallback for Amplify environments that do not expose server-only variables to Next route runtime.
- `ASCENT_WEBSITE_API_TOKEN`: optional server-side token for ARWeb-to-backend requests.
- `ASCENT_APPSYNC_GRAPHQL_ENDPOINT`: server-side AppSync endpoint used for signed-in credit checkout.
- `NEXT_PUBLIC_ASCENT_APPSYNC_GRAPHQL_ENDPOINT`: non-secret fallback for Amplify environments that do not expose server-only variables to Next route runtime.

## Android Download Page

The canonical public app destination is `/download`. Existing website calls to action read `NEXT_PUBLIC_APP_DOWNLOAD_URL`, which should stay `/download` unless a temporary external download destination is needed.

The page renders from `public/download/android-latest.json`. The Android release workflow in `Finn-Warez/ar-social-game` updates this manifest when a signed APK is published to GitHub Releases. ARWeb stores only release metadata and the GitHub asset URL; APK binaries do not belong in this repository.

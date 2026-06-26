# ARWeb

Public transmission site for Ascent.

## Local Development

```bash
npm install
npm run dev
```

The website can render without backend secrets. Public form and donation routes proxy to `ASCENT_WEBSITE_API_URL` when configured and return a clear unavailable response otherwise. Credit checkout uses the signed-in Cognito/AppSync path and requires the browser bearer token created by the Cognito PKCE account relay.

## Environment

- `NEXT_PUBLIC_SITE_URL`: canonical public site URL.
- `NEXT_PUBLIC_COGNITO_DOMAIN`: Cognito Hosted UI base URL for the same Ascent account used by Android.
- `NEXT_PUBLIC_COGNITO_HOSTED_UI_URL`: optional legacy Hosted UI entrypoint; `NEXT_PUBLIC_COGNITO_DOMAIN` is preferred.
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`: public Cognito website client ID used for authorization-code + PKCE sign-in.
- `NEXT_PUBLIC_APP_DOWNLOAD_URL`: beta/app download destination.
- `NEXT_PUBLIC_ASCENT_ACCESS_TOKEN_STORAGE_KEY`: browser storage key for the Cognito access token used by credit checkout.
- `NEXT_PUBLIC_ASCENT_ID_TOKEN_STORAGE_KEY`: browser storage key for the Cognito ID token.
- `NEXT_PUBLIC_ASCENT_TOKEN_EXPIRY_STORAGE_KEY`: browser storage key for the token expiry timestamp.
- `NEXT_PUBLIC_ASCENT_PKCE_VERIFIER_STORAGE_KEY`: browser storage key for the transient PKCE verifier.
- `NEXT_PUBLIC_ASCENT_OAUTH_STATE_STORAGE_KEY`: browser storage key for the transient OAuth state value.
- `ASCENT_WEBSITE_API_URL`: server-side Ascent backend website/payment API base URL.
- `ASCENT_WEBSITE_API_TOKEN`: optional server-side token for ARWeb-to-backend requests.
- `ASCENT_APPSYNC_GRAPHQL_ENDPOINT`: server-side AppSync endpoint used for signed-in credit checkout.

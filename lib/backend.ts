type ProxyResult = {
  status: number;
  body: unknown;
};

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

export async function proxyToAscentBackend(path: string, payload: unknown): Promise<ProxyResult> {
  const baseUrl = process.env.ASCENT_WEBSITE_API_URL;
  if (!baseUrl) {
    return {
      status: 503,
      body: {
        ok: false,
        message: "The relay is not accepting this request yet.",
      },
    };
  }

  const response = await fetch(new URL(path, baseUrl), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.ASCENT_WEBSITE_API_TOKEN ? { authorization: `Bearer ${process.env.ASCENT_WEBSITE_API_TOKEN}` } : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  let body: unknown = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { ok: false, message: text };
    }
  }
  return { status: response.status, body };
}

export async function proxyToAscentAppSync<T>(
  authorization: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<ProxyResult> {
  const endpoint = process.env.ASCENT_APPSYNC_GRAPHQL_ENDPOINT;
  if (!endpoint) {
    return {
      status: 503,
      body: {
        ok: false,
        message: "The account relay is not configured yet.",
      },
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const body = (await response.json()) as GraphQlResponse<T>;
  if (!response.ok || body.errors?.length) {
    return {
      status: response.ok ? 400 : response.status,
      body: {
        ok: false,
        message: body.errors?.[0]?.message ?? "The account relay rejected the request.",
      },
    };
  }

  return { status: 200, body: body.data ?? {} };
}

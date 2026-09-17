# @cuongcds/octivo-node

Node.js SDK for the [Octivo CRM](https://octivo.cloud) API. Lead capture is the first
resource covered — a public, unauthenticated endpoint used by landing pages/widgets to
create a row in `crm_leads`, scoped to a channel via its public `source_id`. More
Octivo CRM resources will be added to this SDK over time.

`Lead` is the primary object the SDK works with: `client.leads.create(...)` resolves
to a `Lead`.

## Install

```bash
npm install @cuongcds/octivo-node
```

## Usage

```ts
import { OctivoClient, ValidationError, ApiError } from '@cuongcds/octivo-node';

// baseUrl defaults to https://octivo.cloud; pass one to target a different environment.
const client = new OctivoClient({ sourceId: 'your-channel-source-id' });

try {
  const lead = await client.leads.create({
    name: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    meta: {
      usecase: 'chatbot_sales',
      utm_source: 'facebook-ads',
      utm_campaign: 'spring-promo',
    },
  });
  // lead.id, lead.success
} catch (error) {
  if (error instanceof ValidationError) {
    // neither email nor phone was provided
  } else if (error instanceof ApiError) {
    // API rejected the request: error.statusCode, error.message, error.responseBody
  }
}
```

At least one of `email`/`phone` must be provided; `name` falls back server-side to the
email/phone when omitted. Fields under `meta`, or any other extra top-level property
passed to `create()`, are stored server-side in the lead's `meta` JSON column.

### Optional reCAPTCHA v3

If the target server has `recaptcha_secret_key` configured, pass a client-generated
token (action `create_lead`) via `recaptchaToken`. It's ignored otherwise.

### Custom HTTP transport

The client uses the global `fetch` API by default (Node.js >= 18). Swap it by
implementing the `HttpClient` interface and passing it as `httpClient` in the
`OctivoClient` constructor options.

## Errors

- `ValidationError` — thrown client-side before any request is sent (missing email
  and phone).
- `ApiError` — thrown when the API responds with an error (invalid `source_id`,
  invalid phone/email, reCAPTCHA failure). Carries `statusCode` and `responseBody`.
- `OctivoError` — base class, also thrown on transport failures (network error,
  timeout).

## Reference

See [docs/crm-lead-api.postman_collection.json](docs/crm-lead-api.postman_collection.json)
for the underlying HTTP API this SDK wraps.

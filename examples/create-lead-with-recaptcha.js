import { ApiError, OctivoClient } from '../dist/esm/index.js';

const sourceId = process.env.OCTIVO_SOURCE_ID ?? 'your-channel-source-id';
const client = new OctivoClient({ sourceId });

/**
 * A reCAPTCHA v3 token is single-use and generated client-side per submission
 * (e.g. by the browser widget calling grecaptcha.execute(siteKey, { action:
 * 'create_lead' })), then posted to your backend alongside the lead form.
 * It's only verified when recaptcha_secret_key is configured server-side for
 * this channel — otherwise it's ignored.
 *
 * This mirrors an Express-style request handler: req.body carries the token
 * fresh on every request, it is never a constant or an env var.
 */
async function handleLeadFormSubmit(req) {
  const lead = await client.leads.create({
    recaptchaToken: req.body.recaptcha_token,
    name: req.body.name,
    phone: req.body.phone,
  });

  return lead;
}

// Simulated incoming request, for demonstration purposes only.
const fakeRequest = {
  body: {
    recaptcha_token: 'token-generated-by-recaptcha-v3-widget',
    name: 'Nguyen Van A',
    phone: '0912345678',
  },
};

try {
  const lead = await handleLeadFormSubmit(fakeRequest);
  console.log(`Lead created: id=${lead.id}`);
} catch (error) {
  if (error instanceof ApiError) {
    // e.g. "Xác thực chống spam thất bại, vui lòng thử lại" when the token is
    // invalid, the action doesn't match 'create_lead', or the score is too low.
    console.error(`API error (${error.statusCode}): ${error.message}`);
  } else {
    throw error;
  }
  process.exitCode = 1;
}

import { ApiError, OctivoClient } from '../dist/esm/index.js';

const sourceId = process.env.OCTIVO_SOURCE_ID ?? 'your-channel-source-id';
const client = new OctivoClient({ sourceId });

// The reCAPTCHA v3 token is generated client-side (e.g. by the browser widget
// calling grecaptcha.execute(siteKey, { action: 'create_lead' })) and passed
// through here. It's only verified when recaptcha_secret_key is configured
// server-side for this channel — otherwise it's ignored.
const recaptchaToken = process.env.OCTIVO_RECAPTCHA_TOKEN ?? 'token-generated-by-recaptcha-v3-widget';

try {
  const lead = await client.leads.create({
    recaptchaToken,
    name: 'Nguyen Van A',
    phone: '0912345678',
  });

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

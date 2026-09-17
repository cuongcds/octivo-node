import { ApiError, OctivoClient, ValidationError } from '../dist/esm/index.js';

// Reads OCTIVO_SOURCE_ID from the environment, falling back to a placeholder
// so the example is runnable out of the box against a sandbox source_id.
const sourceId = process.env.OCTIVO_SOURCE_ID ?? 'your-channel-source-id';

// baseUrl defaults to https://octivo.cloud; pass one to target a different
// environment (e.g. a local/staging instance).
const client = new OctivoClient({ sourceId });

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

  console.log(`Lead created: id=${lead.id} success=${lead.success}`);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation error: ${error.message}`);
  } else if (error instanceof ApiError) {
    console.error(`API error (${error.statusCode}): ${error.message}`);
  } else {
    throw error;
  }
  process.exitCode = 1;
}

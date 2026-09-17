import { ApiError, OctivoClient } from '../dist/esm/index.js';

const sourceId = process.env.OCTIVO_SOURCE_ID ?? 'your-channel-source-id';
const client = new OctivoClient({ sourceId });

// Only phone is required; name falls back server-side to the phone number.
try {
  const lead = await client.leads.create({ phone: '0912345678' });
  console.log(`Lead created: id=${lead.id}`);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API error (${error.statusCode}): ${error.message}`);
  } else {
    throw error;
  }
  process.exitCode = 1;
}

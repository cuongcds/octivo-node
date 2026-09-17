import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_BASE_URL, OctivoClient } from '../src/OctivoClient.js';
import { ApiError, ValidationError } from '../src/errors.js';
import { FakeHttpClient } from './FakeHttpClient.js';

test('leads.create sends expected URL and fields', async () => {
  const http = new FakeHttpClient(200, '{"id": 1, "success": true}');
  const client = new OctivoClient({ baseUrl: 'https://octivo.cloud/', sourceId: 'src-123', httpClient: http });

  const lead = await client.leads.create({
    phone: '0912345678',
    name: 'Nguyen Van A',
    meta: { utm_source: 'facebook-ads' },
  });

  assert.equal(lead.id, 1);
  assert.equal(lead.success, true);
  assert.equal(http.lastUrl, 'https://octivo.cloud/api/lead/src-123');
  assert.deepEqual(http.lastFields, {
    utm_source: 'facebook-ads',
    name: 'Nguyen Van A',
    phone: '0912345678',
  });
});

test('leads.create defaults baseUrl to https://octivo.cloud when omitted', async () => {
  const http = new FakeHttpClient(200, '{"id": 1, "success": true}');
  const client = new OctivoClient({ sourceId: 'src-123', httpClient: http });

  await client.leads.create({ phone: '0912345678' });

  assert.equal(http.lastUrl, `${DEFAULT_BASE_URL}/api/lead/src-123`);
});

test('missing email and phone throws ValidationError without sending a request', async () => {
  const http = new FakeHttpClient(200, '{"id": 1, "success": true}');
  const client = new OctivoClient({ baseUrl: 'https://octivo.cloud', sourceId: 'src-123', httpClient: http });

  await assert.rejects(() => client.leads.create({ name: 'Nguyen Van A' }), ValidationError);
  assert.equal(http.lastUrl, null);
});

test('API error response throws ApiError', async () => {
  const body = '{"success": false, "error_message": "Nguồn không hợp lệ", "source_id": "bad"}';
  const http = new FakeHttpClient(400, body);
  const client = new OctivoClient({ baseUrl: 'https://octivo.cloud', sourceId: 'bad', httpClient: http });

  await assert.rejects(
    () => client.leads.create({ phone: '0912345678' }),
    (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'Nguồn không hợp lệ');
      assert.equal(error.responseBody.source_id, 'bad');
      return true;
    }
  );
});

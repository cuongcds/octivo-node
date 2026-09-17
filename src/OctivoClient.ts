import { FetchHttpClient, HttpClient } from './httpClient.js';
import { LeadsResource } from './LeadsResource.js';

export const DEFAULT_BASE_URL = 'https://octivo.cloud';

export interface OctivoClientOptions {
  sourceId: string;
  baseUrl?: string;
  httpClient?: HttpClient;
}

/**
 * SDK client for the Octivo CRM API. Lead capture is the first resource
 * exposed here; more Octivo CRM resources will be added over time.
 *
 * Usage:
 *   const client = new OctivoClient({ sourceId: '...' });
 *   const lead = await client.leads.create({ phone: '0912345678' });
 */
export class OctivoClient {
  readonly leads: LeadsResource;

  constructor(options: OctivoClientOptions) {
    const baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    const httpClient = options.httpClient ?? new FetchHttpClient();

    this.leads = new LeadsResource(httpClient, baseUrl, options.sourceId);
  }
}

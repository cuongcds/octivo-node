import { FetchHttpClient, HttpClient } from './httpClient.js';
import { LeadsResource } from './LeadsResource.js';

export interface OctivoClientOptions {
  baseUrl: string;
  sourceId: string;
  httpClient?: HttpClient;
}

/**
 * SDK client for the CRM Lead capture API.
 *
 * Usage:
 *   const client = new OctivoClient({ baseUrl: '...', sourceId: '...' });
 *   const lead = await client.leads.create({ phone: '0912345678' });
 */
export class OctivoClient {
  readonly leads: LeadsResource;

  constructor(options: OctivoClientOptions) {
    const baseUrl = options.baseUrl.replace(/\/+$/, '');
    const httpClient = options.httpClient ?? new FetchHttpClient();

    this.leads = new LeadsResource(httpClient, baseUrl, options.sourceId);
  }
}

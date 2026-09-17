import { HttpClient, HttpResponse } from '../src/httpClient.js';

export class FakeHttpClient implements HttpClient {
  lastUrl: string | null = null;
  lastFields: Record<string, unknown> | null = null;

  constructor(
    private readonly statusCode: number,
    private readonly body: string
  ) {}

  async postForm(url: string, fields: Record<string, unknown>): Promise<HttpResponse> {
    this.lastUrl = url;
    this.lastFields = fields;

    return { statusCode: this.statusCode, body: this.body };
  }
}

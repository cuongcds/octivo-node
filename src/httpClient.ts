import { OctivoError } from './errors.js';

export interface HttpResponse {
  statusCode: number;
  body: string;
}

export interface HttpClient {
  postForm(url: string, fields: Record<string, unknown>): Promise<HttpResponse>;
}

/** Default transport, built on the global fetch API (Node.js >= 18). */
export class FetchHttpClient implements HttpClient {
  constructor(private readonly timeoutMs = 10_000) {}

  async postForm(url: string, fields: Record<string, unknown>): Promise<HttpResponse> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: controller.signal,
      });

      const body = await response.text();

      return { statusCode: response.status, body };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new OctivoError(`HTTP request failed: ${reason}`);
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function parseJson(body: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

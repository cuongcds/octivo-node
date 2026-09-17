import { ApiError } from './errors.js';
import { HttpClient, parseJson } from './httpClient.js';
import { CreateLeadInput, Lead, toFormFields, validateCreateLeadInput } from './Lead.js';

/** Resource for operations on Leads, scoped to a single channel (source_id). */
export class LeadsResource {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly baseUrl: string,
    private readonly sourceId: string
  ) {}

  /**
   * Create a lead for this channel.
   *
   * @throws ValidationError when the input is missing required fields
   * @throws ApiError when the API rejects the request (invalid source_id, invalid
   *                  phone/email, reCAPTCHA failure, ...)
   * @throws OctivoError on transport-level failure
   */
  async create(input: CreateLeadInput): Promise<Lead> {
    validateCreateLeadInput(input);

    const url = `${this.baseUrl}/api/lead/${this.sourceId}`;
    const response = await this.httpClient.postForm(url, toFormFields(input));
    const data = parseJson(response.body);

    if (response.statusCode >= 400 || data.success === false) {
      const message = typeof data.error_message === 'string' ? data.error_message : 'Request to CRM Lead API failed';
      throw new ApiError(message, response.statusCode, data);
    }

    return Lead.fromResponse(data);
  }
}

import axios, { AxiosInstance } from 'axios';

export class AsaasService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.asaas.com/v3',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private buildHeaders(apiKeyOverride?: string) {
    const key = apiKeyOverride || process.env.ASAAS_API_KEY || '';
    return key
      ? {
          access_token: key,
        }
      : {};
  }

  async createCharge(payload: {
    customer: { name: string };
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'BANK_TRANSFER';
    value: number;
    description?: string;
    apiKeyOverride?: string;
  }) {
    const { apiKeyOverride, ...body } = payload;
    const headers = this.buildHeaders(apiKeyOverride);
    const resp = await this.client.post('/payments', body, { headers });
    return resp.data;
  }

  async getPayment(id: string, apiKeyOverride?: string) {
    const headers = this.buildHeaders(apiKeyOverride);
    const resp = await this.client.get(`/payments/${encodeURIComponent(id)}`, { headers });
    return resp.data;
  }
}

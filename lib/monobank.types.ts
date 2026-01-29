export interface MonobankInvoiceRequest {
  amount: number; // в копійках
  ccy?: number; // 980 для UAH
  merchantPaymInfo?: {
    reference?: string;
    destination?: string;
    comment?: string;
    basketOrder?: Array<{
      name: string;
      qty: number;
      sum: number;
      icon?: string;
      unit?: string;
    }>;
  };
  redirectUrl?: string;
  webHookUrl?: string;
  validity?: number; // в секундах
  paymentType?: 'debit' | 'hold';
}

export interface MonobankInvoiceResponse {
  invoiceId: string;
  pageUrl: string;
}

export interface MonobankWebhookPayload {
  invoiceId: string;
  status: 'created' | 'processing' | 'hold' | 'success' | 'failure' | 'reversed' | 'expired';
  failureReason?: string;
  amount: number;
  ccy: number;
  finalAmount?: number;
  createdDate: string;
  modifiedDate: string;
  reference?: string;
  cancelList?: Array<{
    status: string;
    amount: number;
    ccy: number;
    createdDate: string;
    modifiedDate: string;
    approvalCode: string;
    rrn: string;
    extRef: string;
  }>;
}

export interface Booking {
  id: string;
  invoiceId: string;
  name: string;
  email: string;
  phone?: string;
  sessionType: string;
  note?: string;
  selectedSlot: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  amount: number;
  createdAt: string;
  paidAt?: string;
  calendarEventId?: string;
}

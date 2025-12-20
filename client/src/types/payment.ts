import type { Timestamp, Decimal } from './common';

export type PaymentProviderType = 'CARD' | 'E-WALLET' | 'BANK_TRANSFER' | 'QR_CODE' | string;

export interface PaymentProvider {
  payment_provider_id: number;
  provider_name?: string;
  provider_type?: PaymentProviderType;
  api_endpoint?: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | string;
export type PaymentMethod = 'CASH' | 'ONLINE' | string;

export interface Payment {
  payment_id: number;
  payment_provider_id: number;
  user_id: number;
  ticket_id: number;
  payment_method?: PaymentMethod;
  amount?: Decimal;
  status?: PaymentStatus;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

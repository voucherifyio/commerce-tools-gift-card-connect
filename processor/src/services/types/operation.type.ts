import {
  AmountSchemaDTO,
  PaymentIntentRequestSchemaDTO,
  PaymentModificationStatus,
} from '../../dtos/operations/payment-intents.dto';
import { StatusResponseSchemaDTO } from '../../dtos/operations/status.dto';
import { Payment } from '@commercetools/connect-payments-sdk';

export type CapturePaymentRequest = {
  amount: AmountSchemaDTO;
  payment: Payment;
};

export type CancelPaymentRequest = {
  payment: Payment;
};

export type RefundPaymentRequest = {
  amount: AmountSchemaDTO;
  payment: Payment;
};

export type ReversePaymentRequest = {
  payment: Payment;
};

export type PaymentProviderModificationResponse = {
  outcome: PaymentModificationStatus;
  pspReference: string;
  amountRefunded?: AmountSchemaDTO;
};

export type StatusResponse = StatusResponseSchemaDTO;

export type ModifyPayment = {
  paymentId: string;
  data: PaymentIntentRequestSchemaDTO;
};

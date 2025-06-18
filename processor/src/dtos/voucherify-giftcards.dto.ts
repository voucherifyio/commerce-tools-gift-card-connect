import { Static, Type } from '@sinclair/typebox';
import { AmountSchema } from './operations/payment-intents.dto';
import { BalanceResponseSchema } from '../schemas/balance-response.schema';
import { RedeemResponseSchema } from '../schemas/redeem-response.schema';

export const ErrorSchema = Type.Object({
  code: Type.String(),
  message: Type.String(),
});

export const StatusSchema = Type.Object({
  state: Type.String(),
  errors: Type.Optional(ErrorSchema),
});

export const RedeemRequestSchema = Type.Object({
  code: Type.String(),
  redeemAmount: AmountSchema,
});

export type RedeemRequestDTO = Static<typeof RedeemRequestSchema>;
export type RedeemResponseDTO = Static<typeof RedeemResponseSchema>;

export type BalanceResponseSchemaDTO = Static<typeof BalanceResponseSchema>;

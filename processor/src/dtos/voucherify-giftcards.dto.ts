import { Static, Type } from '@sinclair/typebox';
import { AmountSchema } from './operations/payment-intents.dto';

export const ErrorSchema = Type.Object({
  code: Type.String(),
  message: Type.String(),
});

const StatusSchema = Type.Object({
  state: Type.String(),
  errors: Type.Optional(ErrorSchema),
});

export const BalanceResponseSchema = Type.Object({
  status: StatusSchema,
  amount: AmountSchema,
});

export const RedeemRequestSchema = Type.Object({
  amount: AmountSchema
})

export const RedeemResponseSchema = Type.Object({
  amount: AmountSchema 
})
export const RdeemResponseSchema = Type.Object({
})
export type RedeemRequestDTO = Static<typeof RedeemRequestSchema>;
export type RedeemResponseDTO = Static<typeof RdeemResponseSchema>;

export type BalanceResponseSchemaDTO = Static<typeof BalanceResponseSchema>;

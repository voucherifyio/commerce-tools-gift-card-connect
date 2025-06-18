import { SessionHeaderAuthenticationHook, SessionQueryParamAuthenticationHook } from '@commercetools/connect-payments-sdk';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { VoucherifyGiftCardService } from '../services/voucherify-giftcard.service';
import { BalanceResponseSchemaDTO, RedeemRequestDTO, RedeemResponseDTO } from '../dtos/voucherify-giftcards.dto';
import { Type } from '@sinclair/typebox';
import { AmountSchema } from '../dtos/operations/payment-intents.dto';
import { BalanceResponseSchema } from '../schemas/balance-response.schema';
import { RedeemResponseSchema } from '../schemas/redeem-response.schema';

type RoutesOptions = {
  giftCardService: VoucherifyGiftCardService;
  sessionHeaderAuthHook: SessionHeaderAuthenticationHook;
  sessionQueryParamAuthHook: SessionQueryParamAuthenticationHook;
};

export const voucherifyGiftCardServiceRoutes = async (
  fastify: FastifyInstance,

  opts: FastifyPluginOptions & RoutesOptions,
) => {
  fastify.get<{ Reply: BalanceResponseSchemaDTO | void; Params: { code: string } }>(
    '/balance/:code',
    {
      preHandler: [opts.sessionHeaderAuthHook.authenticate()],
      schema: {
        params: {
          type: 'object',
          properties: {
            code: Type.String({ minLength: 1})
          },
          required: ['code'],
        },
        response: {
          200: BalanceResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const res = await opts.giftCardService.balance(request.params.code);
      return reply.status(200).send(res);
    },
  );

  fastify.post<{ Body: RedeemRequestDTO; Reply: RedeemResponseDTO }>(
    '/redeem',
    {
      preHandler: [opts.sessionHeaderAuthHook.authenticate()],
      schema: {
        body: {
          type: 'object',
          properties: {
            code: Type.String({ minLength: 1}),
            redeemAmount: AmountSchema,
          },
          required: ['code', 'redeemAmount'],
        },
        response: {
          200: RedeemResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const res = await opts.giftCardService.redeem({
        data: request.body,
      });

      return reply.status(200).send(res);
    },
  );
};

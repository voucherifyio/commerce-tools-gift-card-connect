import {
  SessionHeaderAuthenticationHook,
  SessionQueryParamAuthenticationHook,
} from '@commercetools/connect-payments-sdk';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { VoucherifyGiftCardService } from '../services/voucherify-giftcard.service';
import {
  BalanceResponseSchema,
  BalanceResponseSchemaDTO,
  RedeemRequestDTO,
  RedeemResponseDTO,
  RedeemResponseSchema,
} from '../dtos/voucherify-giftcards.dto';
import { Type } from '@sinclair/typebox';
import { AmountSchema } from '../dtos/operations/payment-intents.dto';

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
            code: Type.String(),
          },
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
    '/redemption',
    {
      preHandler: [opts.sessionHeaderAuthHook.authenticate()],
      schema: {
        body: {
          type: 'object',
          properties: {
            code: Type.String(),
            balance: Type.Optional(AmountSchema),
            redeemAmount: Type.Optional(AmountSchema),
          },
          required: ['code'],
          if: {
            properties: {
              balance: {
                const: {},
              },
            },
          },
          then: {
            required: ['redeemAmount'],
          },
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

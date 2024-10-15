import {
  SessionHeaderAuthenticationHook,
  SessionQueryParamAuthenticationHook,
} from '@commercetools/connect-payments-sdk';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {} from '../dtos/voucherify-giftcards.dto';

type RoutesOptions = {
  // giftCardService: VoucherifyGiftCardService;
  sessionHeaderAuthHook: SessionHeaderAuthenticationHook;
  sessionQueryParamAuthHook: SessionQueryParamAuthenticationHook;
};

export const voucherifyGiftCardServiceRoutes = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _fastify: FastifyInstance,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  opts: FastifyPluginOptions & RoutesOptions,
) => {};

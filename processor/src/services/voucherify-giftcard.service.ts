import {
  CommercetoolsCartService,
  CommercetoolsPaymentService,
  healthCheckCommercetoolsPermissions,
  statusHandler,
  CommercetoolsOrderService,
  ErrorGeneral,
} from '@commercetools/connect-payments-sdk';
import {
  CancelPaymentRequest,
  CapturePaymentRequest,
  PaymentProviderModificationResponse,
  RefundPaymentRequest,
  StatusResponse,
} from './types/operation.type';
import { getConfig } from '../config/config';
import { appLogger, paymentSDK } from '../payment-sdk';
import { AbstractGiftCardService } from './abstract-giftcard.service';
import { VoucherifyAPI } from '../clients/voucherify.client';
import { BalanceResponseSchemaDTO, RedeemRequestDTO, RedeemResponseDTO } from '../dtos/voucherify-giftcards.dto';
import { VoucherifyApiError } from '../errors/voucherify-api.error';
import { log } from '../libs/logger';
import { BalanceConverter } from './converters/balance-converter';
import { RedemptionConverter } from './converters/redemption-converter';
import { getCartIdFromContext, getPaymentInterfaceFromContext } from '../libs/fastify/context/context';

import { PaymentModificationStatus } from '../dtos/operations/payment-intents.dto';

import { RedemptionsRedeemStackableParams } from '../clients/types/redemptions';
import { VoucherifyError } from '../clients/voucherify.error';
import { UnsupportedVoucherTypeCustomError } from '../errors/unsupported-voucher-type.error';
import { handleStackableValidationResult } from '../validators/stackable-redeemable.validator';
import { handleError } from '../errors/error-handler';
import { RequestParametersBuilder } from '../builders/request-parameters.builder';
import { ValidationsValidateStackableParams } from '../clients/types/validations';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJSON = require('../../package.json');

export type VoucherifyGiftCardServiceOptions = {
  ctCartService: CommercetoolsCartService;
  ctPaymentService: CommercetoolsPaymentService;
  ctOrderService: CommercetoolsOrderService;
};

export class VoucherifyGiftCardService extends AbstractGiftCardService {
  private balanceConverter: BalanceConverter;
  private redemptionConverter: RedemptionConverter;
  constructor(opts: VoucherifyGiftCardServiceOptions) {
    super(opts.ctCartService, opts.ctPaymentService, opts.ctOrderService);
    this.balanceConverter = new BalanceConverter();
    this.redemptionConverter = new RedemptionConverter();
  }

  /**
   * Get status
   *
   * @remarks
   * Implementation to provide mocking status of external systems
   *
   * @returns Promise with mocking data containing a list of status from different external systems
   */
  async status(): Promise<StatusResponse> {
    const handler = await statusHandler({
      timeout: getConfig().healthCheckTimeout,
      log: appLogger,
      checks: [
        healthCheckCommercetoolsPermissions({
          requiredPermissions: [
            'manage_payments',
            'view_sessions',
            'view_api_clients',
            'manage_orders',
            'introspect_oauth_tokens',
            'manage_checkout_payment_intents',
          ],
          ctAuthorizationService: paymentSDK.ctAuthorizationService,
          projectKey: getConfig().projectKey,
        }),
        async () => {
          try {
            const result = await VoucherifyAPI().vouchers.list({
              limit: 1,
            });
            return {
              name: 'Voucherify Status check',
              status: 'UP',
              details: {
                vouchers: result.vouchers,
              },
            };
          } catch (e) {
            return {
              name: 'Voucherify Status check',
              status: 'DOWN',
              message: `Not able to talk to the Voucherify API`,
              details: {
                error: e,
              },
            };
          }
        },
      ],
      metadataFn: async () => ({
        name: packageJSON.name,
        description: packageJSON.description,
      }),
    })();

    return handler.body;
  }

  async balance(code: string): Promise<BalanceResponseSchemaDTO> {
    try {
      const ctCart = await this.ctCartService.getCart({ id: getCartIdFromContext() });
      const amountPlanned = await this.ctCartService.getPaymentAmount({ cart: ctCart });

      const voucher = await VoucherifyAPI().vouchers.get(code);
      if (voucher.type !== 'GIFT_VOUCHER') {
        throw new UnsupportedVoucherTypeCustomError();
      }

      const metadataPropertyKeys = await VoucherifyAPI().metadataSchemas.getProperties('product');

      const params = new RequestParametersBuilder<ValidationsValidateStackableParams>()
        .setRedeemable(code, Math.min(voucher.gift!.balance, amountPlanned.centAmount))
        .setOrder(
          ctCart.taxedPrice?.totalGross?.centAmount || ctCart.totalPrice.centAmount,
          ctCart.lineItems,
          metadataPropertyKeys,
          amountPlanned.currencyCode,
        )
        .setSession(getCartIdFromContext())
        .setCustomer(ctCart.customerId || ctCart.anonymousId, ctCart.shippingAddress)
        .build();

      const validationResult = await VoucherifyAPI().validations.validateStackable(params);

      if (!validationResult.valid) {
        handleStackableValidationResult(validationResult);
      }

      return this.balanceConverter.convert(validationResult);
    } catch (err) {
      log.error('Error fetching gift card', { error: err });
      return handleError(err);
    }
  }

  async redeem(opts: { data: RedeemRequestDTO }): Promise<RedeemResponseDTO> {
    try {
      const ctCart = await this.ctCartService.getCart({ id: getCartIdFromContext() });
      const amountPlanned = await this.ctCartService.getPaymentAmount({ cart: ctCart });
      const redeemAmount = opts.data.redeemAmount;
      const redeemCode = opts.data.code;

      const voucher = await VoucherifyAPI().vouchers.get(redeemCode);
      if (voucher.type !== 'GIFT_VOUCHER') {
        throw new UnsupportedVoucherTypeCustomError();
      }

      const ctPayment = await this.ctPaymentService.createPayment({
        amountPlanned: redeemAmount,
        paymentMethodInfo: {
          paymentInterface: getPaymentInterfaceFromContext() || 'voucherify',
          method: 'giftcard',
        },
        ...(ctCart.customerId && {
          customer: {
            typeId: 'customer',
            id: ctCart.customerId,
          },
        }),
        ...(!ctCart.customerId &&
          ctCart.anonymousId && {
            anonymousId: ctCart.anonymousId,
          }),
      });

      await this.ctCartService.addPayment({
        resource: {
          id: ctCart.id,
          version: ctCart.version,
        },
        paymentId: ctPayment.id,
      });

      const metadataPropertyKeys = await VoucherifyAPI().metadataSchemas.getProperties('product');
      const params = new RequestParametersBuilder<RedemptionsRedeemStackableParams>()
        .setRedeemable(redeemCode, redeemAmount.centAmount)
        .setOrder(
          ctCart.taxedPrice?.totalGross?.centAmount || ctCart.totalPrice.centAmount,
          ctCart.lineItems,
          metadataPropertyKeys,
          amountPlanned.currencyCode,
        )
        .setSession(getCartIdFromContext())
        .setCustomer(ctCart.customerId || ctCart.anonymousId, ctCart.shippingAddress)
        .build();

      const redeemStackableResult = await VoucherifyAPI().redemptions.redeemStackable(params);
      const voucherifyRedemptionId = redeemStackableResult.redemptions[0].id;

      const updatedPayment = await this.ctPaymentService.updatePayment({
        id: ctPayment.id,
        pspReference: voucherifyRedemptionId,
        transaction: {
          type: 'Charge',
          amount: ctPayment.amountPlanned,
          interactionId: voucherifyRedemptionId,
          state: this.redemptionConverter.convertVoucherifyResultCode(redeemStackableResult.redemptions[0].result),
        },
      });

      return this.redemptionConverter.convert({
        redemptionResult: redeemStackableResult,
        createPaymentResult: updatedPayment,
      });
    } catch (err) {
      log.error('Error in giftcard redemption', { error: err });
      return handleError(err);
    }
  }

  /**
   * Capture payment
   *
   * @remarks
   * Implementation to provide the mocking data for payment capture in external PSPs
   *
   * @param request - contains the amount and {@link https://docs.commercetools.com/api/projects/payments | Payment } defined in composable commerce
   * @returns Promise with mocking data containing operation status and PSP reference
   */
  async capturePayment(request: CapturePaymentRequest): Promise<PaymentProviderModificationResponse> {
    throw new ErrorGeneral('operation not supported', {
      fields: {
        pspReference: request.payment.interfaceId,
      },
      privateMessage: "connector doesn't support capture operation",
    });
  }

  /**
   * Cancel payment
   *
   * @remarks
   * Implementation to provide the mocking data for payment cancel in external PSPs
   *
   * @param request - contains {@link https://docs.commercetools.com/api/projects/payments | Payment } defined in composable commerce
   * @returns Promise with mocking data containing operation status and PSP reference
   */
  async cancelPayment(request: CancelPaymentRequest): Promise<PaymentProviderModificationResponse> {
    throw new ErrorGeneral('operation not supported', {
      fields: {
        pspReference: request.payment.interfaceId,
      },
      privateMessage: "connector doesn't support cancel operation",
    });
  }

  /**
   * Refund payment
   *
   * @remarks
   * Implementation to provide the mocking data for payment refund in external PSPs
   *
   * @param request - contains amount and {@link https://docs.commercetools.com/api/projects/payments | Payment } defined in composable commerce
   * @returns Promise with mocking data containing operation status and PSP reference
   */
  async refundPayment(request: RefundPaymentRequest): Promise<PaymentProviderModificationResponse> {
    const ctPayment = await this.ctPaymentService.getPayment({
      id: request.payment.id,
    });
    const redemptionId = ctPayment.interfaceId;

    try {
      await this.ctPaymentService.updatePayment({
        id: request.payment.id,
        transaction: {
          type: 'Refund',
          amount: request.amount,
          state: 'Initial',
        },
      });

      const rollbackResult = await VoucherifyAPI().redemptions.rollback(redemptionId as string);

      await this.ctPaymentService.updatePayment({
        id: request.payment.id,
        transaction: {
          type: 'Refund',
          amount: request.amount,
          interactionId: rollbackResult.id,
          state: rollbackResult.result ? 'Success' : 'Failure',
        },
      });

      return {
        outcome:
          rollbackResult.result === 'SUCCESS' ? PaymentModificationStatus.APPROVED : PaymentModificationStatus.REJECTED,
        pspReference: rollbackResult.id,
        amountRefunded: {
          currencyCode: ctPayment.amountPlanned.currencyCode,
          centAmount: Math.abs(rollbackResult.amount || 0),
        },
      };
    } catch (err) {
      if (err instanceof VoucherifyError) {
        throw new VoucherifyApiError(
          {
            code: err.code,
            message: err.message,
            key: err.key,
          },
          {
            privateFields: {
              details: err.details,
            },
            cause: err,
          },
        );
      }

      throw new ErrorGeneral('Internal Server Error', {
        privateMessage: 'internal error rolling back a redemption on voucherify',
        cause: err,
      });
    }
  }
}

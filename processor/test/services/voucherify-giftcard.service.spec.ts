import { describe, test, expect, afterEach, jest, afterAll, beforeAll, beforeEach } from '@jest/globals';
import { setupServer } from 'msw/node';
import {
  VoucherifyGiftCardService,
  VoucherifyGiftCardServiceOptions,
} from '../../src/services/voucherify-giftcard.service';
import { paymentSDK } from '../../src/payment-sdk';
import { AbstractGiftCardService } from '../../src/services/abstract-giftcard.service';
import { HealthCheckResult } from '@commercetools/connect-payments-sdk';
import {
  listVouchersOk,
  rollbackVouchersRedemptionOk,
  validateVouchersOk,
  redeemVouchersOk,
  getVoucherOk,
  listMetadataSchemasOk,
  getNotExistingVoucher,
} from '../mocks/voucherify';
import * as StatusHandler from '@commercetools/connect-payments-sdk/dist/api/handlers/status.handler';
import * as Config from '../../src/config/config';
import { mockRequest } from '../mocks/utils';
import { ModifyPayment, StatusResponse } from '../../src/services/types/operation.type';
import { DefaultCartService } from '@commercetools/connect-payments-sdk/dist/commercetools/services/ct-cart.service';
import { getCartOK, getPaymentResultOk, updatePaymentResultOk, createPaymentResultOk } from '../mocks/coco';
import { DefaultPaymentService } from '@commercetools/connect-payments-sdk/dist/commercetools/services/ct-payment.service';
import { VoucherifyApiError } from '../../src/errors/voucherify-api.error';
import { UnsupportedVoucherTypeCustomError } from '../../src/errors/unsupported-voucher-type.error';

interface FlexibleConfig {
  [key: string]: string | number | undefined; // Adjust the type according to your config values
}

function setupMockConfig(keysAndValues: Record<string, string>) {
  const mockConfig: FlexibleConfig = {};
  Object.keys(keysAndValues).forEach((key) => {
    mockConfig[key] = keysAndValues[key];
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jest.spyOn(Config, 'getConfig').mockReturnValue(mockConfig as any);
  jest.spyOn(DefaultCartService.prototype, 'getCart').mockResolvedValue(getCartOK());
}

describe('voucherify-giftcard.service', () => {
  const mockServer = setupServer();
  const opts: VoucherifyGiftCardServiceOptions = {
    ctCartService: paymentSDK.ctCartService,
    ctPaymentService: paymentSDK.ctPaymentService,
    ctOrderService: paymentSDK.ctOrderService,
  };

  const giftcardService: AbstractGiftCardService = new VoucherifyGiftCardService(opts);

  beforeAll(() => {
    mockServer.listen({
      onUnhandledRequest: 'bypass',
    });
  });

  beforeEach(() => {
    jest.setTimeout(10000);
    jest.resetAllMocks();
  });

  afterAll(() => {
    mockServer.close();
  });

  afterEach(() => {
    mockServer.resetHandlers();
  });

  test('getStatus', async () => {
    const mockHealthCheckFunction: () => Promise<HealthCheckResult> = async () => {
      const result: HealthCheckResult = {
        name: 'CoCo Permissions',
        status: 'DOWN',
        details: {},
      };
      return result;
    };

    jest.spyOn(StatusHandler, 'healthCheckCommercetoolsPermissions').mockReturnValue(mockHealthCheckFunction);
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/vouchers`, 200, listVouchersOk));
    const result: StatusResponse = await giftcardService.status();

    expect(result?.status).toBeDefined();
    expect(result?.checks).toHaveLength(2);
    expect(result?.status).toStrictEqual('Partially Available');
    expect(result?.checks[0]?.name).toStrictEqual('CoCo Permissions');
    expect(result?.checks[0]?.status).toStrictEqual('DOWN');
    expect(result?.checks[0]?.details).toStrictEqual({});
    expect(result?.checks[1]?.name).toStrictEqual('Voucherify Status check');
    expect(result?.checks[1]?.status).toStrictEqual('UP');
    expect(result?.checks[1]?.details).toBeDefined();
  });

  test('balance passed', async () => {
    const code = 'some-code';

    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/validations`, 200, validateVouchersOk));
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/vouchers/${code}`, 200, getVoucherOk));
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/metadata-schemas`, 200, listMetadataSchemasOk));

    const result = await giftcardService.balance(code);

    expect(result?.status.state).toStrictEqual('Valid');
    expect(result?.amount.currencyCode).toStrictEqual('USD');
  });

  test('balance failed: voucher not found', async () => {
    const code = 'some-code';

    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/vouchers/${code}`, 404, getNotExistingVoucher));

    // Act
    const result = giftcardService.balance(code);

    // Assert
    await expect(result).rejects.toThrow(VoucherifyApiError);
    await expect(result).rejects.toThrowError('Cannot find voucher with id some-code');
  });

  test('balance failed: voucher is not a gift type', async () => {
    const code = 'some-code';

    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(
      mockRequest('https://api.voucherify.io', `/v1/vouchers/${code}`, 200, {
        ...getVoucherOk,
        type: 'DISCOUNT_VOUCHER',
      }),
    );

    // Act
    const result = giftcardService.balance(code);

    // Assert
    await expect(result).rejects.toThrow(UnsupportedVoucherTypeCustomError);
    await expect(result).rejects.toThrowError('Voucher is not supported. Only gift vouchers are supported.');
  });

  test('redeem passed', async () => {
    const code = '34567';

    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/redemptions`, 200, redeemVouchersOk));
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/vouchers/${code}`, 200, getVoucherOk));
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/metadata-schemas`, 200, listMetadataSchemasOk));

    jest.spyOn(DefaultPaymentService.prototype, 'createPayment').mockResolvedValue(createPaymentResultOk);
    jest.spyOn(DefaultCartService.prototype, 'addPayment').mockResolvedValue(getCartOK());
    jest.spyOn(DefaultPaymentService.prototype, 'updatePayment').mockResolvedValue(updatePaymentResultOk);

    // Act
    const result = await giftcardService.redeem({
      data: {
        code: code,
        redeemAmount: {
          centAmount: 1,
          currencyCode: 'USD',
        },
      },
    });

    // Assert
    expect(result.result).toStrictEqual('Success');
    expect(result.redemptionId).toStrictEqual('REDEMPTION_ID');
    expect(result.paymentReference).toStrictEqual('123456');
  });

  test('redeem failed: voucher not found', async () => {
    const code = '34567';

    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/vouchers/${code}`, 404, getNotExistingVoucher));

    jest.spyOn(DefaultCartService.prototype, 'getCart').mockResolvedValue(getCartOK());

    // Act
    const result = giftcardService.redeem({
      data: {
        code: code,
        redeemAmount: {
          centAmount: 1,
          currencyCode: 'USD',
        },
      },
    });

    // Assert
    await expect(result).rejects.toThrow(VoucherifyApiError);
    await expect(result).rejects.toThrowError('Cannot find voucher with id some-code');
  });

  test('redeem failed: voucher is not a gift type', async () => {
    const code = '34567';

    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(
      mockRequest('https://api.voucherify.io', `/v1/vouchers/${code}`, 200, {
        ...getVoucherOk,
        type: 'DISCOUNT_VOUCHER',
      }),
    );

    jest.spyOn(DefaultCartService.prototype, 'getCart').mockResolvedValue(getCartOK());

    // Act
    const result = giftcardService.redeem({
      data: {
        code: code,
        redeemAmount: {
          centAmount: 1,
          currencyCode: 'USD',
        },
      },
    });

    // Assert
    await expect(result).rejects.toThrow(UnsupportedVoucherTypeCustomError);
    await expect(result).rejects.toThrowError('Voucher is not supported. Only gift vouchers are supported.');
  });

  describe('modifyPayment', () => {
    test('capturePayment', async () => {
      // Given
      const modifyPaymentOpts: ModifyPayment = {
        paymentId: 'dummy-paymentId',
        data: {
          actions: [
            {
              action: 'capturePayment',
              amount: {
                centAmount: 1000,
                currencyCode: 'EUR',
              },
            },
          ],
        },
      };

      jest.spyOn(DefaultPaymentService.prototype, 'getPayment').mockResolvedValue(getPaymentResultOk);
      jest.spyOn(DefaultPaymentService.prototype, 'updatePayment').mockResolvedValue(updatePaymentResultOk);

      const result = giftcardService.modifyPayment(modifyPaymentOpts);
      expect(result).rejects.toThrowError('operation not supported');
    });

    test('cancelPayment', async () => {
      // Given
      const modifyPaymentOpts: ModifyPayment = {
        paymentId: 'dummy-paymentId',
        data: {
          actions: [
            {
              action: 'cancelPayment',
            },
          ],
        },
      };

      jest.spyOn(DefaultPaymentService.prototype, 'getPayment').mockResolvedValue(getPaymentResultOk);
      jest.spyOn(DefaultPaymentService.prototype, 'updatePayment').mockResolvedValue(updatePaymentResultOk);

      const result = giftcardService.modifyPayment(modifyPaymentOpts);
      expect(result).rejects.toThrowError('operation not supported');
    });

    test('refundPayment', async () => {
      // Given
      const redemptionId = getPaymentResultOk.interfaceId;

      mockServer.use(
        mockRequest(
          'https://api.voucherify.io',
          `/v1/redemptions/${redemptionId}/rollback`,
          200,
          rollbackVouchersRedemptionOk,
        ),
      );

      const modifyPaymentOpts: ModifyPayment = {
        paymentId: 'dummy-paymentId',
        data: {
          actions: [
            {
              action: 'refundPayment',
              amount: {
                centAmount: 3000,
                currencyCode: 'EUR',
              },
            },
          ],
        },
      };

      jest.spyOn(DefaultPaymentService.prototype, 'getPayment').mockResolvedValue(getPaymentResultOk);
      jest.spyOn(DefaultPaymentService.prototype, 'updatePayment').mockResolvedValue(updatePaymentResultOk);

      const result = await giftcardService.modifyPayment(modifyPaymentOpts);
      expect(result?.outcome).toStrictEqual('approved');
    });
  });
});

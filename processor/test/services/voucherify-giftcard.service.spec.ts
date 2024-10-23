import { describe, test, expect, afterEach, jest, afterAll, beforeAll, beforeEach } from '@jest/globals';
import { setupServer } from 'msw/node';
import {
  VoucherifyGiftCardService,
  VoucherifyGiftCardServiceOptions,
} from '../../src/services/voucherify-giftcard.service';
import { paymentSDK } from '../../src/payment-sdk';
import { AbstractGiftCardService } from '../../src/services/abstract-giftcard.service';
import { HealthCheckResult } from '@commercetools/connect-payments-sdk';
import { listVouchersOk, validateVouchersNotOk, validateVouchersOk } from '../mocks/voucherify';
import * as StatusHandler from '@commercetools/connect-payments-sdk/dist/api/handlers/status.handler';
import * as Config from '../../src/config/config';
import { mockRequest } from '../mocks/utils';
import { StatusResponse } from '../../src/services/types/operation.type';
import { DefaultCartService } from '@commercetools/connect-payments-sdk/dist/commercetools/services/ct-cart.service';
import { getCartOK } from '../mocks/coco';

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
    // jest.restoreAllMocks();
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

  test('balance OK', async () => {
    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/validations`, 200, validateVouchersOk));
    // jest.spyOn(DefaultCartService.prototype, 'getCart').mockResolvedValue(getCartOK());

    const result = await giftcardService.balance('some-code');
    expect(result?.status.state).toStrictEqual('Valid');
    expect(result?.amount.currencyCode).toStrictEqual('USD');
  });

  test('balance Not-OK', async () => {
    setupMockConfig({ voucherifyCurrency: 'USD' });
    mockServer.use(mockRequest('https://api.voucherify.io', `/v1/validations`, 200, validateVouchersNotOk));

    const result = giftcardService.balance('some-code');
    await expect(result).rejects.toThrowError('voucher with given code does not exist');
  });
});

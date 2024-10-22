import { describe, test, expect } from '@jest/globals';
import { BalanceConverter } from '../../../src/services/converters/balance-converter';
import { StackableRedeemableResultResponse } from '../../../src/clients/types/stackable';

describe('balance.converter', () => {
  const converter = new BalanceConverter();

  test('convert a valid gift card response', () => {
    const argument: StackableRedeemableResultResponse = {
      gift: {
        balance: 10000,
        credits: 1,
      },
    };

    // Act
    const result = converter.valid(argument);

    // Assert
    expect(result).toEqual({
      status: {
        state: 'Valid',
      },
      amount: {
        centAmount: 10000,
        currencyCode: '',
      },
    });
  });

  test('convert invalid - voucher expired gift card response', () => {
    const argument: StackableRedeemableResultResponse = {
      gift: {
        balance: 10000,
        credits: 1,
      },
      error: {
        code: 400,
        key: 'voucher_expired',
        message: 'gift card expired',
        details: 'voucher has already expired',
      },
    };

    // Act and Assert
    expect(() => converter.invalid(argument)).toThrowError('voucher has already expired');
  });

  test('convert invalid - no key gift card response', () => {
    const argument: StackableRedeemableResultResponse = {
      error: {
        code: 400,
        message: 'An error happened',
      },
    };

    // Act and Assert
    expect(() => converter.invalid(argument)).toThrowError('An error happened');
  });

  test('convert invalid - not found gift card response', () => {
    const argument: StackableRedeemableResultResponse = {
      error: {
        code: 404,
        key: 'not_found',
        message: 'Resource not found',
        details: 'voucher with given code does not exist',
      },
    };

    // Act and Assert
    expect(() => converter.invalid(argument)).toThrowError('voucher with given code does not exist');
  });
});

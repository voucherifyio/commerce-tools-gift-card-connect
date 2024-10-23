import { describe, test, expect } from '@jest/globals';
import { VoucherifyError, generateMessage } from '../../src/clients/voucherify.error'; // Adjust the import path based on your project structure

describe('VoucherifyError', () => {
  test('should correctly instantiate with the given parameters', () => {
    const statusCode = 404;
    const body = {
      message: 'Resource not found',
      code: 404,
      key: 'resource_not_found',
      details: 'The requested resource was not found',
      request_id: 'req_123',
      resource_id: 'res_456',
      resource_type: 'voucher',
      related_object_ids: ['rel_789'],
      related_object_type: 'order',
      related_object_total: 1,
      error: { message: 'error message' },
    };
    const axiosError = { message: 'Axios error' };

    const error = new VoucherifyError(statusCode, body, axiosError);

    expect(error.message).toBe('Resource not found');
    expect(error.code).toBe(404);
    expect(error.key).toBe('resource_not_found');
    expect(error.details).toBe('The requested resource was not found');
    expect(error.request_id).toBe('req_123');
    expect(error.resource_id).toBe('res_456');
    expect(error.resource_type).toBe('voucher');
    expect(error.related_object_ids).toEqual(['rel_789']);
    expect(error.related_object_type).toBe('order');
    expect(error.related_object_total).toBe(1);
    expect(error.error?.message).toBe('error message');
    expect(error.cause).toEqual(axiosError);
  });

  test('should default message to generated message if body.message is not present', () => {
    const statusCode = 500;
    const body = {
      code: 500,
      key: 'internal_error',
    };
    const axiosError = { message: 'Axios error' };

    const error = new VoucherifyError(statusCode, body, axiosError);

    expect(error.message).toBe(`Unexpected status code: 500 - Details: ${JSON.stringify(body, null, 2)}`);
  });

  test('should handle an empty body correctly', () => {
    const statusCode = 400;
    const error = new VoucherifyError(statusCode, undefined, undefined);

    expect(error.message).toBe('Unexpected status code: 400 - Details: {}');
    expect(error.code).toBeUndefined();
    expect(error.key).toBeUndefined();
    expect(error.details).toBeUndefined();
    expect(error.request_id).toBeUndefined();
    expect(error.resource_id).toBeUndefined();
    expect(error.resource_type).toBeUndefined();
    expect(error.related_object_ids).toBeUndefined();
    expect(error.related_object_type).toBeUndefined();
    expect(error.related_object_total).toBeUndefined();
    expect(error.error).toBeUndefined();
    expect(error.cause).toBeUndefined();
  });
});

describe('generateMessage', () => {
  test('should return a generated message with stringified body for non-string body', () => {
    const body = { key: 'value' };
    const statusCode = 400;
    const expectedMessage = `Unexpected status code: 400 - Details: ${JSON.stringify(body, null, 2)}`;

    const message = generateMessage(body, statusCode);
    expect(message).toBe(expectedMessage);
  });

  test('should return a generated message with the body as-is if test is a string', () => {
    const body = 'This is an error';
    const statusCode = 404;
    const expectedMessage = `Unexpected status code: 404 - Details: ${body}`;

    const message = generateMessage(body, statusCode);
    expect(message).toBe(expectedMessage);
  });
});

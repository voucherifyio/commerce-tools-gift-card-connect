/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from '@jest/globals';
import {
  encode,
  isNumber,
  isString,
  isOptionalString,
  isObject,
  isOptionalObject,
  environment,
  assert,
} from '../../src/clients/helpers'; // Adjust the import based on file name and path

describe('Utility Functions', () => {
  describe('encode', () => {
    test('should encode a string correctly', () => {
      expect(encode('hello world')).toBe('hello%20world');
      expect(encode('')).toBe('');
    });
  });

  describe('isNumber', () => {
    test('should return true for valid numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(NaN)).toBe(false); // NaN is a special case, should return false
    });

    test('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe('isString', () => {
    test('should return true for valid strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
    });

    test('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe('isOptionalString', () => {
    test('should return true for strings or undefined/null', () => {
      expect(isOptionalString('hello')).toBe(true);
      expect(isOptionalString(undefined)).toBe(true);
      expect(isOptionalString(null)).toBe(true);
    });

    test('should return false for non-string values', () => {
      expect(isOptionalString(123)).toBe(false);
      expect(isOptionalString({})).toBe(false);
    });
  });

  describe('isObject', () => {
    test('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
    });

    test('should return false for non-objects', () => {
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject('string')).toBe(false);
    });
  });

  describe('isOptionalObject', () => {
    test('should return true for objects, null or undefined', () => {
      expect(isOptionalObject({})).toBe(true);
      expect(isOptionalObject(null)).toBe(true);
      expect(isOptionalObject(undefined)).toBe(true);
    });

    test('should return false for non-object types', () => {
      expect(isOptionalObject([])).toBe(false);
      expect(isOptionalObject(123)).toBe(false);
    });
  });

  describe('environment', () => {
    test('should return "Browser" when in a browser environment', () => {
      const originalWindow = global.window;
      global.window = { document: {} } as any; // mock window object

      expect(environment()).toBe('Browser');
      global.window = originalWindow; // restore original window object
    });

    test('should return "WebWorker" when in a WebWorker environment', () => {
      const originalSelf = global.self;
      global.self = { constructor: { name: 'DedicatedWorkerGlobalScope' } } as any; // mock self object

      expect(environment()).toBe('WebWorker');
      global.self = originalSelf; // restore original self object
    });
  });

  describe('assert', () => {
    test('should not throw if condition is true', () => {
      expect(() => assert(true)).not.toThrow();
    });

    test('should throw if condition is false', () => {
      expect(() => assert(false, 'error message')).toThrow('error message');
    });
  });
});

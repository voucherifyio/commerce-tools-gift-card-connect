import { describe, test, expect, beforeAll } from '@jest/globals';
import I18n from '../src/i18n/index';
import { Translations } from '../src/i18n/definitions';

const mockTranslations: Translations = {
  en: {
    greeting: 'Hello',
    farewell: 'Goodbye',
  },
  es: {
    greeting: 'Hola',
    farewell: 'Adiós',
  },
};

describe('i18n - translate', () => {
  let i18n: I18n;

  beforeAll(() => {
    i18n = new I18n(mockTranslations);
  });

  test('return correct translation for a given key and language', () => {
    expect(i18n.translate('greeting', 'es')).toBe('Hola');
    expect(i18n.translate('farewell', 'en')).toBe('Goodbye');
  });

  test('falls back to default language if translation key is missing in the selected language', () => {
    expect(i18n.translate('farewell', 'es')).toBe('Adiós');
    delete mockTranslations['es'].farewell;
    expect(i18n.translate('farewell', 'es')).toBe('Goodbye');
  });

  test('falls back to default language if language is unsupported', () => {
    expect(i18n.translate('greeting', 'fr')).toBe('Hello');
  });

  test('returns key if translation is missing in both selected and default languages', () => {
    expect(i18n.translate('unknown_key', 'es')).toBe('unknown_key');
  });

  test('returns default language translation if lang is undefined', () => {
    expect(i18n.translate('greeting', undefined)).toBe('Hello');
  });

  test('returns default language translation if language is an empty string', () => {
    expect(i18n.translate('greeting', '')).toBe('Hello');
  });
});

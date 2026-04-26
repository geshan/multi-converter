import { describe, it, expect } from 'vitest';
import {
  convertTemperature,
  convertWeight,
  UnrecognizedUnitError,
  BelowAbsoluteZeroError,
  NegativeWeightError,
} from './converterService';

describe('convertTemperature', () => {
  describe('known values', () => {
    it('converts 0°C to 32°F', () => {
      expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
    });

    it('converts 0°C to 273.15 K', () => {
      expect(convertTemperature(0, 'celsius', 'kelvin')).toBe(273.15);
    });

    it('converts 100°C to 212°F', () => {
      expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212);
    });

    it('converts 100°C to 373.15 K', () => {
      expect(convertTemperature(100, 'celsius', 'kelvin')).toBe(373.15);
    });

    it('converts 32°F to 0°C', () => {
      expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0);
    });

    it('converts 273.15 K to 0°C', () => {
      expect(convertTemperature(273.15, 'kelvin', 'celsius')).toBe(0);
    });
  });

  describe('absolute zero boundary', () => {
    it('throws BelowAbsoluteZeroError for -273.15°C', () => {
      expect(() => convertTemperature(-273.15, 'celsius', 'fahrenheit')).not.toThrow();
    });

    it('throws BelowAbsoluteZeroError for values below -273.15°C', () => {
      expect(() => convertTemperature(-273.16, 'celsius', 'fahrenheit')).toThrow(BelowAbsoluteZeroError);
    });

    it('throws BelowAbsoluteZeroError for -459.67°F (at absolute zero)', () => {
      expect(() => convertTemperature(-459.67, 'fahrenheit', 'celsius')).not.toThrow();
    });

    it('throws BelowAbsoluteZeroError for values below -459.67°F', () => {
      expect(() => convertTemperature(-459.68, 'fahrenheit', 'celsius')).toThrow(BelowAbsoluteZeroError);
    });

    it('does not throw for 0 K (absolute zero)', () => {
      expect(() => convertTemperature(0, 'kelvin', 'celsius')).not.toThrow();
    });

    it('throws BelowAbsoluteZeroError for values below 0 K', () => {
      expect(() => convertTemperature(-0.001, 'kelvin', 'celsius')).toThrow(BelowAbsoluteZeroError);
    });

    it('does not throw for values just above absolute zero in Celsius', () => {
      expect(() => convertTemperature(-273.14, 'celsius', 'kelvin')).not.toThrow();
    });
  });

  describe('identity conversion', () => {
    it('returns original value when source and target are the same (celsius)', () => {
      expect(convertTemperature(25, 'celsius', 'celsius')).toBe(25);
    });

    it('returns original value when source and target are the same (fahrenheit)', () => {
      expect(convertTemperature(98.6, 'fahrenheit', 'fahrenheit')).toBe(98.6);
    });

    it('returns original value when source and target are the same (kelvin)', () => {
      expect(convertTemperature(300, 'kelvin', 'kelvin')).toBe(300);
    });
  });

  describe('unrecognized unit', () => {
    it('throws UnrecognizedUnitError for unknown source unit', () => {
      expect(() => convertTemperature(100, 'rankine' as never, 'celsius')).toThrow(UnrecognizedUnitError);
    });

    it('throws UnrecognizedUnitError for unknown target unit', () => {
      expect(() => convertTemperature(100, 'celsius', 'rankine' as never)).toThrow(UnrecognizedUnitError);
    });

    it('includes the unrecognized unit name in the error message', () => {
      expect(() => convertTemperature(100, 'rankine' as never, 'celsius')).toThrow('rankine');
    });
  });
});

describe('convertWeight', () => {
  describe('known values', () => {
    it('converts 1 kg to 2.20462 lbs', () => {
      expect(convertWeight(1, 'kilograms', 'pounds')).toBe(2.2046);
    });

    it('converts 1 kg to 1000 g', () => {
      expect(convertWeight(1, 'kilograms', 'grams')).toBe(1000);
    });

    it('converts 1 kg to 35.274 oz', () => {
      expect(convertWeight(1, 'kilograms', 'ounces')).toBe(35.274);
    });

    it('converts 1000 g to 1 kg', () => {
      expect(convertWeight(1000, 'grams', 'kilograms')).toBe(1);
    });
  });

  describe('negative weight boundary', () => {
    it('throws NegativeWeightError for -0.001', () => {
      expect(() => convertWeight(-0.001, 'kilograms', 'grams')).toThrow(NegativeWeightError);
    });

    it('does not throw for 0 weight', () => {
      expect(() => convertWeight(0, 'kilograms', 'grams')).not.toThrow();
    });

    it('does not throw for positive weight', () => {
      expect(() => convertWeight(0.001, 'kilograms', 'grams')).not.toThrow();
    });
  });

  describe('identity conversion', () => {
    it('returns original value when source and target are the same (kilograms)', () => {
      expect(convertWeight(5, 'kilograms', 'kilograms')).toBe(5);
    });

    it('returns original value when source and target are the same (grams)', () => {
      expect(convertWeight(500, 'grams', 'grams')).toBe(500);
    });

    it('returns original value when source and target are the same (pounds)', () => {
      expect(convertWeight(10, 'pounds', 'pounds')).toBe(10);
    });
  });

  describe('unrecognized unit', () => {
    it('throws UnrecognizedUnitError for unknown source unit', () => {
      expect(() => convertWeight(1, 'stones' as never, 'kilograms')).toThrow(UnrecognizedUnitError);
    });

    it('throws UnrecognizedUnitError for unknown target unit', () => {
      expect(() => convertWeight(1, 'kilograms', 'stones' as never)).toThrow(UnrecognizedUnitError);
    });

    it('includes the unrecognized unit name in the error message', () => {
      expect(() => convertWeight(1, 'stones' as never, 'kilograms')).toThrow('stones');
    });
  });
});

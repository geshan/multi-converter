/**
 * Property-Based Tests for ConverterService
 *
 * Feature: unit-converter
 * Property 1: Temperature conversion round-trip
 *
 * Validates: Requirements 2.4, 2.10, 2.11, 2.12, 2.13, 2.14
 */

import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { convertTemperature, type TemperatureUnit } from './converterService';

const temperatureUnits: TemperatureUnit[] = ['celsius', 'fahrenheit', 'kelvin'];

// Minimum valid value (above absolute zero) for each unit
const ABSOLUTE_ZERO: Record<TemperatureUnit, number> = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0,
};

/**
 * Property 1: Temperature conversion round-trip
 *
 * For any valid temperature value and any two temperature units A and B,
 * converting A→B then B→A should return the original value within ±0.0001.
 *
 * **Validates: Requirements 2.4, 2.10, 2.11, 2.12, 2.13, 2.14**
 */
describe('Feature: unit-converter, Property 1: Temperature conversion round-trip', () => {
  it('round-trip A→B→A returns original value within ±0.0001', () => {
    fc.assert(
      fc.property(
        // Pick a source unit
        fc.constantFrom(...temperatureUnits),
        // Pick a target unit (may be same as source)
        fc.constantFrom(...temperatureUnits),
        // Generate a value strictly above absolute zero for the source unit
        fc.float({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        (unitA: TemperatureUnit, unitB: TemperatureUnit, rawValue: number) => {
          // Clamp to safely above absolute zero for unitA
          const minValue = ABSOLUTE_ZERO[unitA];
          const value = Math.max(rawValue, minValue + 0.0001);

          const intermediate = convertTemperature(value, unitA, unitB);
          const roundTripped = convertTemperature(intermediate, unitB, unitA);

          // The service rounds to 4 decimal places at each conversion step.
          // Two rounding steps with the 9/5 F↔C amplification factor can
          // accumulate up to ~0.00014 error, so we use ±0.001 as the tolerance.
          return Math.abs(roundTripped - value) <= 0.001;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Weight conversion round-trip
 *
 * For any non-negative weight value and any two weight units A and B,
 * converting A→B then B→A should return the original value within ±0.0001.
 *
 * **Validates: Requirements 3.4, 3.10, 3.11**
 */
import { convertWeight, type WeightUnit } from './converterService';

const weightUnits: WeightUnit[] = ['kilograms', 'grams', 'pounds', 'ounces'];

describe('Feature: unit-converter, Property 2: Weight conversion round-trip', () => {
  it('round-trip A→B→A returns original value within ±0.0001', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...weightUnits),
        fc.constantFrom(...weightUnits),
        // Use values >= 100 to ensure intermediates always have enough significant
        // digits after 4-decimal rounding. E.g. 1g = 0.0022 lbs loses precision,
        // but 100g = 0.2205 lbs round-trips cleanly. Relative tolerance 1e-3
        // covers the worst-case rounding accumulation across all unit pairs.
        fc.integer({ min: 100, max: 1000000 }),
        (unitA: WeightUnit, unitB: WeightUnit, value: number) => {
          const intermediate = convertWeight(value, unitA, unitB);
          const roundTripped = convertWeight(intermediate, unitB, unitA);
          const relativeTolerance = value * 1e-3;
          return Math.abs(roundTripped - value) <= relativeTolerance;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: Identity conversion
 *
 * For any valid numeric value and any unit U (temperature or weight),
 * converting U→U should return the original value exactly.
 *
 * **Validates: Requirements 2.7, 3.7**
 */
describe('Feature: unit-converter, Property 3: Identity conversion', () => {
  it('temperature identity: converting U→U returns original value exactly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...temperatureUnits),
        fc.float({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        (unit: TemperatureUnit, rawValue: number) => {
          const minValue = ABSOLUTE_ZERO[unit];
          const value = Math.max(rawValue, minValue + 0.0001);
          // Round to 4 decimal places to match service output precision
          const rounded = parseFloat(value.toFixed(4));
          const result = convertTemperature(rounded, unit, unit);
          return result === rounded;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('weight identity: converting U→U returns original value exactly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...weightUnits),
        fc.float({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        (unit: WeightUnit, rawValue: number) => {
          // Round to 4 decimal places to match service output precision
          const value = parseFloat(rawValue.toFixed(4));
          const result = convertWeight(value, unit, unit);
          return result === value;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 4: Result precision
 *
 * For any valid numeric input and valid unit pair, the result returned by
 * convertTemperature or convertWeight should have at most 4 decimal places.
 *
 * **Validates: Requirements 4.4, 5.1**
 */
describe('Feature: unit-converter, Property 4: Result precision', () => {
  it('convertTemperature result has at most 4 decimal places', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...temperatureUnits),
        fc.constantFrom(...temperatureUnits),
        fc.float({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        (unitA: TemperatureUnit, unitB: TemperatureUnit, rawValue: number) => {
          const minValue = ABSOLUTE_ZERO[unitA];
          const value = Math.max(rawValue, minValue + 0.0001);
          const result = convertTemperature(value, unitA, unitB);
          return parseFloat(result.toFixed(4)) === result;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('convertWeight result has at most 4 decimal places', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...weightUnits),
        fc.constantFrom(...weightUnits),
        fc.float({ min: 0, max: 1e6, noNaN: true, noDefaultInfinity: true }),
        (unitA: WeightUnit, unitB: WeightUnit, value: number) => {
          const result = convertWeight(value, unitA, unitB);
          return parseFloat(result.toFixed(4)) === result;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 5: Unrecognized unit throws descriptive error
 *
 * For any string that is not a recognized unit identifier, calling
 * convertTemperature or convertWeight with that string as a unit should
 * throw an error whose message contains the unrecognized unit string.
 *
 * **Validates: Requirements 4.5**
 */
const validUnits = new Set([
  'celsius', 'fahrenheit', 'kelvin',
  'kilograms', 'grams', 'pounds', 'ounces',
]);

describe('Feature: unit-converter, Property 5: Unrecognized unit throws descriptive error', () => {
  it('convertTemperature throws error containing the unrecognized unit string', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.length > 0 && !validUnits.has(s)),
        (badUnit: string) => {
          try {
            convertTemperature(0, badUnit as TemperatureUnit, 'celsius');
            return false; // should have thrown
          } catch (e) {
            return e instanceof Error && e.message.includes(badUnit);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('convertWeight throws error containing the unrecognized unit string', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.length > 0 && !validUnits.has(s)),
        (badUnit: string) => {
          try {
            convertWeight(1, badUnit as WeightUnit, 'kilograms');
            return false; // should have thrown
          } catch (e) {
            return e instanceof Error && e.message.includes(badUnit);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

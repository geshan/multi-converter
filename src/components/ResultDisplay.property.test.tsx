/**
 * Property-Based Tests for ResultDisplay
 *
 * Feature: unit-converter
 * Property 6: Result display includes unit label
 * Property 7: Whole-number results have no trailing decimal zeros
 */

import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import ResultDisplay from './ResultDisplay';

/**
 * Property 6: Result display includes unit label
 *
 * For any conversion result and target unit, the rendered ResultDisplay output
 * should contain the target unit's label string.
 *
 * **Validates: Requirements 5.3**
 */
describe('Feature: unit-converter, Property 6: Result display includes unit label', () => {
  it('rendered output contains the unit label string', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.string({ minLength: 1 }),
        (value: number, unit: string) => {
          const { container, unmount } = render(
            <ResultDisplay value={value} unit={unit} error={null} />
          );
          const text = container.textContent ?? '';
          const found = text.includes(unit);
          unmount();
          return found;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 7: Whole-number results have no trailing decimal zeros
 *
 * For any conversion that produces a whole-number result, the formatted display
 * string should not contain a decimal point followed only by zeros.
 *
 * **Validates: Requirements 5.2**
 */
describe('Feature: unit-converter, Property 7: Whole-number results have no trailing decimal zeros', () => {
  it('rendered text does not contain a decimal point followed only by zeros', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1_000_000, max: 1_000_000 }),
        (value: number) => {
          const { container, unmount } = render(
            <ResultDisplay value={value} unit="kg" error={null} />
          );
          const text = container.textContent ?? '';
          // Must not contain a decimal point followed only by zeros (e.g. "32.0" or "32.0000")
          const hasTrailingZeros = /\.\d*0+(\s|$)/.test(text) && !/\.[^0]/.test(text);
          unmount();
          return !hasTrailingZeros;
        }
      ),
      { numRuns: 100 }
    );
  });
});

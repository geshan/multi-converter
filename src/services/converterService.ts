// Temperature unit identifiers
export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

// Weight unit identifiers
export type WeightUnit = 'kilograms' | 'grams' | 'pounds' | 'ounces';

// Thrown when a unit identifier is not recognized
export class UnrecognizedUnitError extends Error {
  constructor(unit: string) {
    super(`Unrecognized unit: "${unit}"`);
    this.name = 'UnrecognizedUnitError';
  }
}

// Thrown when a temperature value is below absolute zero
export class BelowAbsoluteZeroError extends Error {
  constructor() {
    super('Value is below absolute zero.');
    this.name = 'BelowAbsoluteZeroError';
  }
}

// Thrown when a weight value is negative
export class NegativeWeightError extends Error {
  constructor() {
    super('Weight cannot be negative.');
    this.name = 'NegativeWeightError';
  }
}

// Absolute zero thresholds per unit
const ABSOLUTE_ZERO: Record<TemperatureUnit, number> = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0,
};

// Convert any temperature unit to Celsius
function toCelsius(value: number, from: TemperatureUnit): number {
  switch (from) {
    case 'celsius': return value;
    case 'fahrenheit': return (value - 32) * 5 / 9;
    case 'kelvin': return value - 273.15;
  }
}

// Convert Celsius to any temperature unit
function fromCelsius(celsius: number, to: TemperatureUnit): number {
  switch (to) {
    case 'celsius': return celsius;
    case 'fahrenheit': return (celsius * 9 / 5) + 32;
    case 'kelvin': return celsius + 273.15;
  }
}

// Weight conversion factors relative to kilograms
const WEIGHT_TO_KG: Record<WeightUnit, number> = {
  kilograms: 1,
  grams: 0.001,
  pounds: 0.453592,
  ounces: 0.0283495,
};

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  const validUnits: WeightUnit[] = ['kilograms', 'grams', 'pounds', 'ounces'];
  if (!validUnits.includes(from as WeightUnit)) throw new UnrecognizedUnitError(from);
  if (!validUnits.includes(to as WeightUnit)) throw new UnrecognizedUnitError(to);

  if (value < 0) throw new NegativeWeightError();

  const kilograms = value * WEIGHT_TO_KG[from];
  const result = kilograms / WEIGHT_TO_KG[to];
  return parseFloat(result.toFixed(4));
}

export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  const validUnits: TemperatureUnit[] = ['celsius', 'fahrenheit', 'kelvin'];
  if (!validUnits.includes(from as TemperatureUnit)) throw new UnrecognizedUnitError(from);
  if (!validUnits.includes(to as TemperatureUnit)) throw new UnrecognizedUnitError(to);

  if (value < ABSOLUTE_ZERO[from]) throw new BelowAbsoluteZeroError();

  const celsius = toCelsius(value, from);
  const result = fromCelsius(celsius, to);
  return parseFloat(result.toFixed(4));
}

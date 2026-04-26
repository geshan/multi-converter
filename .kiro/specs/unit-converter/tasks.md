# Implementation Plan: Unit Converter

## Overview

Implement a React + TypeScript unit converter app with a pure service layer for temperature and weight conversions. The build order is: service layer first (pure logic, fully testable), then shared UI primitives, then converter components, then the top-level App with tab navigation.

## Tasks

- [x] 1. Bootstrap project and configure tooling
  - Scaffold a React + TypeScript project (e.g., Vite)
  - Install dependencies: `react`, `react-dom`, `typescript`, `fast-check`, and a test runner (e.g., Vitest + `@testing-library/react`)
  - Configure `tsconfig.json` and test runner config
  - _Requirements: 4.1, 4.6_

- [x] 2. Implement the Converter Service layer
  - [x] 2.1 Define unit types and custom error classes
    - Create `src/services/converterService.ts`
    - Define `TemperatureUnit` and `WeightUnit` union types
    - Implement `UnrecognizedUnitError`, `BelowAbsoluteZeroError`, and `NegativeWeightError` classes
    - _Requirements: 4.1, 4.2, 4.5_

  - [x] 2.2 Implement `convertTemperature`
    - Chain all conversions through Celsius as intermediate unit
    - Apply formulas: C↔F (`F = (C × 9/5) + 32`), C↔K (`K = C + 273.15`)
    - Validate below-absolute-zero inputs; throw `BelowAbsoluteZeroError`
    - Throw `UnrecognizedUnitError` for unknown unit identifiers
    - Round result to max 4 decimal places using `parseFloat(value.toFixed(4))`
    - _Requirements: 2.10, 2.11, 2.12, 2.13, 2.14, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.3 Implement `convertWeight`
    - Normalize to kilograms using `WEIGHT_TO_KG` factors, then convert to target
    - Validate negative inputs; throw `NegativeWeightError`
    - Throw `UnrecognizedUnitError` for unknown unit identifiers
    - Round result to max 4 decimal places
    - _Requirements: 3.10, 3.11, 4.2, 4.3, 4.4, 4.5_

  - [x]* 2.4 Write unit tests for ConverterService
    - Test known values: 0°C = 32°F = 273.15 K; 1 kg = 2.20462 lbs = 1000 g = 35.274 oz
    - Test absolute zero boundary (−273.15°C, −459.67°F, 0 K)
    - Test negative weight boundary
    - Test unrecognized unit throws with unit name in message
    - _Requirements: 2.10–2.14, 3.10, 3.11, 4.4, 4.5_

  - [x]* 2.5 Write property test — Property 1: Temperature round-trip
    - **Property 1: Temperature conversion round-trip**
    - Generate random valid temperatures and unit pairs; convert A→B→A; assert result within ±0.0001 of original
    - **Validates: Requirements 2.4, 2.10, 2.11, 2.12, 2.13, 2.14**

  - [x]* 2.6 Write property test — Property 2: Weight round-trip
    - **Property 2: Weight conversion round-trip**
    - Generate random non-negative weights and unit pairs; convert A→B→A; assert result within ±0.0001 of original
    - **Validates: Requirements 3.4, 3.10, 3.11**

  - [x]* 2.7 Write property test — Property 3: Identity conversion
    - **Property 3: Identity conversion**
    - Generate random values and any unit; convert U→U; assert result equals original value exactly
    - **Validates: Requirements 2.7, 3.7**

  - [x]* 2.8 Write property test — Property 4: Result precision
    - **Property 4: Result precision**
    - Generate random valid inputs and unit pairs; assert returned number has at most 4 decimal places
    - **Validates: Requirements 4.4, 5.1**

  - [x]* 2.9 Write property test — Property 5: Unrecognized unit throws descriptive error
    - **Property 5: Unrecognized unit throws descriptive error**
    - Generate random strings that are not valid unit identifiers; assert thrown error message contains the unrecognized unit string
    - **Validates: Requirements 4.5**

- [x] 3. Checkpoint — service layer complete
  - Ensure all service tests pass, ask the user if questions arise.

- [x] 4. Implement shared UI primitive components
  - [x] 4.1 Implement `InputField` component
    - Create `src/components/InputField.tsx`
    - Render a labeled `<input type="text">` with `htmlFor` / `id` association
    - Accept `value`, `onChange`, and `label` props
    - _Requirements: 2.3, 3.3, 6.2_

  - [x] 4.2 Implement `UnitSelector` component
    - Create `src/components/UnitSelector.tsx`
    - Render a labeled `<select>` with `htmlFor` / `id` association
    - Accept `units` (array of `{value, label}`), `value`, `onChange`, and `label` props
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 6.2_

  - [x] 4.3 Implement `ResultDisplay` component
    - Create `src/components/ResultDisplay.tsx`
    - When `error` prop is non-null, render the error message; otherwise render `"{value} {unit}"`
    - Format value with `parseFloat(value.toFixed(4))` to strip trailing zeros
    - _Requirements: 2.4, 2.8, 3.4, 3.8, 5.1, 5.2, 5.3_

  - [x]* 4.4 Write unit tests for primitive components
    - `InputField`: assert label is associated with input via `htmlFor`/`id`
    - `UnitSelector`: assert label association; assert all unit options are rendered
    - `ResultDisplay`: assert result with unit label; assert error message replaces result; assert no trailing zeros on whole numbers
    - _Requirements: 5.1, 5.2, 5.3, 6.2_

  - [x]* 4.5 Write property test — Property 6: Result display includes unit label
    - **Property 6: Result display includes unit label**
    - Generate random numeric results and target unit labels; render `ResultDisplay`; assert rendered output contains the unit label string
    - **Validates: Requirements 5.3**

  - [x]* 4.6 Write property test — Property 7: Whole-number results have no trailing decimal zeros
    - **Property 7: Whole-number results have no trailing decimal zeros**
    - Generate inputs that produce whole-number results; render `ResultDisplay`; assert rendered string does not contain `"."` followed only by zeros
    - **Validates: Requirements 5.2**

- [ ] 5. Implement TemperatureConverter component
  - Create `src/components/TemperatureConverter.tsx`
  - Manage `ConverterState` (inputValue, sourceUnit, targetUnit, result, error) with `useState`
  - On any state change, validate input (non-numeric → error), then call `ConverterService.convertTemperature`; catch errors and set `error` state
  - Render `InputField`, two `UnitSelector` instances (source/target), and `ResultDisplay`
  - _Requirements: 2.1–2.9_

  - [ ]* 5.1 Write unit tests for TemperatureConverter
    - Assert correct unit options are rendered in both selectors
    - Assert result updates when input value changes
    - Assert result updates when source or target unit changes
    - Assert error message shown for non-numeric input
    - Assert error message shown for below-absolute-zero input
    - _Requirements: 2.1–2.9_

- [ ] 6. Implement WeightConverter component
  - Create `src/components/WeightConverter.tsx`
  - Manage `ConverterState` with `useState`
  - On any state change, validate input (non-numeric → error), then call `ConverterService.convertWeight`; catch errors and set `error` state
  - Render `InputField`, two `UnitSelector` instances, and `ResultDisplay`
  - _Requirements: 3.1–3.9_

  - [ ]* 6.1 Write unit tests for WeightConverter
    - Assert correct unit options are rendered in both selectors
    - Assert result updates when input value changes
    - Assert result updates when source or target unit changes
    - Assert error message shown for non-numeric input
    - Assert error message shown for negative weight input
    - _Requirements: 3.1–3.9_

- [ ] 7. Implement TabBar component and App root
  - [ ] 7.1 Implement `TabBar` component
    - Create `src/components/TabBar.tsx`
    - Render two `<button role="tab">` elements for "Temperature" and "Weight"
    - Apply a visible active indicator (e.g., CSS class) to the active tab
    - Handle `ArrowLeft` / `ArrowRight` keyboard events to move focus and fire `onTabChange`
    - Accept `activeTab` and `onTabChange` props
    - _Requirements: 1.1, 1.3, 6.3, 6.4_

  - [ ] 7.2 Implement `App` root component
    - Create `src/App.tsx`
    - Manage `activeTab` state (default `'temperature'`)
    - Render `TabBar` and conditionally render `TemperatureConverter` or `WeightConverter`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 7.3 Write unit tests for TabBar and App
    - Assert "Temperature" tab is active by default
    - Assert clicking "Weight" tab shows `WeightConverter` and hides `TemperatureConverter`
    - Assert clicking "Temperature" tab shows `TemperatureConverter`
    - Assert keyboard arrow navigation moves focus and activates tabs
    - _Requirements: 1.1–1.5, 6.3, 6.4_

- [ ] 8. Apply responsive layout and accessibility styles
  - Add CSS (or CSS modules) ensuring the layout is usable from 320 px to 1920 px without horizontal scrolling
  - Verify all `<label>` / `htmlFor` associations are in place across all components
  - _Requirements: 6.1, 6.2_

- [ ]* 8.1 Write integration tests for full App render
  - Render `App`; assert tab switching shows/hides correct converters
  - Assert end-to-end flow: enter a value → see correct result with unit label
  - _Requirements: 1.1–1.5, 2.4, 3.4_

- [ ] 9. Final checkpoint — Ensure all tests pass
  - Run the full test suite; ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- The service layer (tasks 2–3) must be complete before UI components (tasks 4–8)
- Property tests use **fast-check** with a minimum of 100 iterations per property
- Unit tests use **Vitest** + **@testing-library/react**

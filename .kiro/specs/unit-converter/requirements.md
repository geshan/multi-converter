# Requirements Document

## Introduction

A multi-unit converter frontend application built with React.js that supports temperature and weight conversions. The app is organized into distinct layers: a service layer that encapsulates all conversion logic (reusable independently of the UI), and a UI layer built with React components. Users can switch between converter types using tabs, select source and target units via dropdowns, and see conversion results in real time.

## Glossary

- **App**: The React.js frontend application as a whole.
- **Converter_Service**: The service layer module that contains all unit conversion logic, independent of any UI framework.
- **Temperature_Converter**: The UI component and associated service logic responsible for temperature unit conversions.
- **Weight_Converter**: The UI component and associated service logic responsible for weight unit conversions.
- **Tab**: A navigational UI element that switches the active converter between Temperature and Weight.
- **Unit_Selector**: A dropdown component that allows the user to select a unit (source or target).
- **Input_Field**: A numeric text field where the user enters the value to convert.
- **Result_Display**: The UI element that shows the converted value.
- **Conversion_Formula**: The mathematical expression used by the Converter_Service to transform a value from one unit to another.

---

## Requirements

### Requirement 1: Tab-Based Navigation

**User Story:** As a user, I want to switch between the temperature and weight converters using tabs, so that I can quickly access the converter I need without leaving the page.

#### Acceptance Criteria

1. THE App SHALL render a tab bar containing exactly two tabs: "Temperature" and "Weight".
2. WHEN the user clicks the "Temperature" tab, THE App SHALL display the Temperature_Converter and hide the Weight_Converter.
3. WHEN the user clicks the "Weight" tab, THE App SHALL display the Weight_Converter and hide the Temperature_Converter.
4. THE App SHALL display the "Temperature" tab as active by default on initial load.
5. WHILE a tab is active, THE App SHALL render the corresponding converter content below the tab bar.

---

### Requirement 2: Temperature Conversion

**User Story:** As a user, I want to convert a temperature value between Celsius, Fahrenheit, and Kelvin, so that I can quickly obtain the equivalent temperature in a different unit.

#### Acceptance Criteria

1. THE Temperature_Converter SHALL provide a Unit_Selector for the source unit containing the options: Celsius, Fahrenheit, and Kelvin.
2. THE Temperature_Converter SHALL provide a Unit_Selector for the target unit containing the options: Celsius, Fahrenheit, and Kelvin.
3. THE Temperature_Converter SHALL provide an Input_Field that accepts a numeric value representing the temperature to convert.
4. WHEN the user enters a numeric value in the Input_Field, THE Temperature_Converter SHALL display the converted value in the Result_Display without requiring a page reload.
5. WHEN the user changes the source Unit_Selector, THE Temperature_Converter SHALL recalculate and update the Result_Display immediately.
6. WHEN the user changes the target Unit_Selector, THE Temperature_Converter SHALL recalculate and update the Result_Display immediately.
7. WHEN the source unit and target unit are identical, THE Temperature_Converter SHALL display the original input value unchanged in the Result_Display.
8. IF the user enters a non-numeric value in the Input_Field, THEN THE Temperature_Converter SHALL display an error message in place of the Result_Display.
9. IF the user enters a temperature value below absolute zero for the selected source unit (below -273.15°C, -459.67°F, or 0 K), THEN THE Temperature_Converter SHALL display a validation error message.
10. THE Converter_Service SHALL implement the Celsius-to-Fahrenheit Conversion_Formula: F = (C × 9/5) + 32.
11. THE Converter_Service SHALL implement the Fahrenheit-to-Celsius Conversion_Formula: C = (F − 32) × 5/9.
12. THE Converter_Service SHALL implement the Celsius-to-Kelvin Conversion_Formula: K = C + 273.15.
13. THE Converter_Service SHALL implement the Kelvin-to-Celsius Conversion_Formula: C = K − 273.15.
14. THE Converter_Service SHALL derive all other temperature conversions by chaining through Celsius as an intermediate unit.

---

### Requirement 3: Weight Conversion

**User Story:** As a user, I want to convert a weight value between Kilograms, Grams, Pounds, and Ounces, so that I can quickly obtain the equivalent weight in a different unit.

#### Acceptance Criteria

1. THE Weight_Converter SHALL provide a Unit_Selector for the source unit containing the options: Kilograms, Grams, Pounds, and Ounces.
2. THE Weight_Converter SHALL provide a Unit_Selector for the target unit containing the options: Kilograms, Grams, Pounds, and Ounces.
3. THE Weight_Converter SHALL provide an Input_Field that accepts a numeric value representing the weight to convert.
4. WHEN the user enters a numeric value in the Input_Field, THE Weight_Converter SHALL display the converted value in the Result_Display without requiring a page reload.
5. WHEN the user changes the source Unit_Selector, THE Weight_Converter SHALL recalculate and update the Result_Display immediately.
6. WHEN the user changes the target Unit_Selector, THE Weight_Converter SHALL recalculate and update the Result_Display immediately.
7. WHEN the source unit and target unit are identical, THE Weight_Converter SHALL display the original input value unchanged in the Result_Display.
8. IF the user enters a non-numeric value in the Input_Field, THEN THE Weight_Converter SHALL display an error message in place of the Result_Display.
9. IF the user enters a negative weight value, THEN THE Weight_Converter SHALL display a validation error message.
10. THE Converter_Service SHALL implement weight conversions using the following base conversion factors relative to Kilograms: 1 Kilogram = 1000 Grams, 1 Kilogram = 2.20462 Pounds, 1 Kilogram = 35.274 Ounces.
11. THE Converter_Service SHALL derive all weight conversions by normalizing to Kilograms as an intermediate unit.

---

### Requirement 4: Service Layer Architecture

**User Story:** As a developer, I want the conversion logic to live in a dedicated service layer, so that it can be reused in other applications independently of the React UI.

#### Acceptance Criteria

1. THE Converter_Service SHALL be implemented as a module with no dependency on any React API, DOM API, or UI framework.
2. THE Converter_Service SHALL export conversion functions that accept a numeric value, a source unit identifier, and a target unit identifier, and return a numeric result.
3. THE Converter_Service SHALL export separate functions or namespaces for temperature conversions and weight conversions.
4. WHEN the Converter_Service receives a valid numeric input with valid unit identifiers, THE Converter_Service SHALL return a numeric result rounded to a maximum of 4 decimal places.
5. IF the Converter_Service receives an unrecognized unit identifier, THEN THE Converter_Service SHALL throw a descriptive error identifying the unrecognized unit.
6. THE Converter_Service SHALL be importable and usable in a non-React JavaScript or TypeScript environment without modification.

---

### Requirement 5: Result Precision and Display

**User Story:** As a user, I want conversion results to be displayed with a consistent and readable precision, so that I can trust and use the values without confusion.

#### Acceptance Criteria

1. THE Result_Display SHALL show the converted value rounded to a maximum of 4 decimal places.
2. WHEN the converted value is a whole number, THE Result_Display SHALL show the value without unnecessary trailing decimal zeros.
3. THE Result_Display SHALL include the target unit label alongside the numeric result (e.g., "98.6 °F", "2.2046 lbs").

---

### Requirement 6: Responsive and Accessible UI

**User Story:** As a user, I want the converter to be usable on both desktop and mobile screen sizes, so that I can perform conversions on any device.

#### Acceptance Criteria

1. THE App SHALL render a usable layout on viewport widths from 320px to 1920px without horizontal scrolling.
2. THE App SHALL associate each Input_Field and Unit_Selector with a visible label so that assistive technologies can identify the purpose of each control.
3. THE App SHALL ensure that the active Tab is distinguishable from inactive tabs through a visible visual indicator (e.g., underline, background color change, or bold text).
4. WHEN the user navigates the Tab bar using keyboard arrow keys, THE App SHALL move focus between tabs and activate the focused tab.

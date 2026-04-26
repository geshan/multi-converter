import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import InputField from './InputField';
import UnitSelector from './UnitSelector';
import ResultDisplay from './ResultDisplay';

// --- InputField ---

describe('InputField', () => {
  it('renders the label text', () => {
    render(<InputField label="Temperature" value="" onChange={() => {}} />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
  });

  it('associates label htmlFor with input id', () => {
    render(<InputField label="Temperature" value="" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Temperature');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('renders with the provided value', () => {
    render(<InputField label="Temperature" value="42" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('42');
  });

  it('calls onChange when input changes', async () => {
    const onChange = vi.fn();
    render(<InputField label="Temperature" value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), '5');
    expect(onChange).toHaveBeenCalled();
  });
});

// --- UnitSelector ---

const tempUnits = [
  { value: 'celsius', label: 'Celsius' },
  { value: 'fahrenheit', label: 'Fahrenheit' },
  { value: 'kelvin', label: 'Kelvin' },
];

describe('UnitSelector', () => {
  it('renders the label text', () => {
    render(
      <UnitSelector label="From" units={tempUnits} value="celsius" onChange={() => {}} />
    );
    expect(screen.getByText('From')).toBeInTheDocument();
  });

  it('associates label htmlFor with select id', () => {
    render(
      <UnitSelector label="From" units={tempUnits} value="celsius" onChange={() => {}} />
    );
    const select = screen.getByRole('combobox');
    const label = screen.getByText('From');
    expect(label).toHaveAttribute('for', select.id);
  });

  it('renders all provided unit options', () => {
    render(
      <UnitSelector label="From" units={tempUnits} value="celsius" onChange={() => {}} />
    );
    expect(screen.getByRole('option', { name: 'Celsius' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fahrenheit' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Kelvin' })).toBeInTheDocument();
  });

  it('calls onChange when selection changes', async () => {
    const onChange = vi.fn();
    render(
      <UnitSelector label="From" units={tempUnits} value="celsius" onChange={onChange} />
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'fahrenheit');
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });
});

// --- ResultDisplay ---

describe('ResultDisplay', () => {
  it('renders result value with unit label', () => {
    render(<ResultDisplay value={32} unit="°F" error={null} />);
    expect(screen.getByText('32 °F')).toBeInTheDocument();
  });

  it('renders error message when error prop is non-null', () => {
    render(<ResultDisplay value={null} unit="°F" error="Invalid input" />);
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('does not render result when error is present', () => {
    render(<ResultDisplay value={32} unit="°F" error="Something went wrong" />);
    expect(screen.queryByText(/32/)).not.toBeInTheDocument();
  });

  it('shows no trailing decimal zeros for whole numbers', () => {
    render(<ResultDisplay value={32} unit="°F" error={null} />);
    // Should render "32 °F" not "32.0000 °F"
    expect(screen.getByText('32 °F')).toBeInTheDocument();
    expect(screen.queryByText(/32\.0/)).not.toBeInTheDocument();
  });

  it('renders nothing when value is null and no error', () => {
    const { container } = render(<ResultDisplay value={null} unit="°F" error={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

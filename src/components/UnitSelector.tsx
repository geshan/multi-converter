import React from 'react';

interface UnitOption {
  value: string;
  label: string;
}

interface UnitSelectorProps {
  units: UnitOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  id?: string;
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ units, value, onChange, label, id }) => {
  const selectId = id ?? slugify(label);

  return (
    <div>
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UnitSelector;

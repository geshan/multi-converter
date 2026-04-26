import React from 'react';

interface InputFieldProps {
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

const InputField: React.FC<InputFieldProps> = ({ value, onChange, label, id }) => {
  const inputId = id ?? slugify(label);

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        type="text"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;

import React from 'react';

interface ResultDisplayProps {
  value: number | null;
  unit: string;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ value, unit, error }) => {
  if (error !== null) {
    return <p className="result-error">{error}</p>;
  }

  if (value === null) {
    return null;
  }

  const formattedValue = parseFloat(value.toFixed(4));

  return <p className="result-value">{formattedValue} {unit}</p>;
};

export default ResultDisplay;

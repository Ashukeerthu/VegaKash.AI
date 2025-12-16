import React from 'react';

interface CalculatorShellProps {
  children: React.ReactNode;
}

const CalculatorShell: React.FC<CalculatorShellProps> = ({ children }) => {
  return (
    <div className="calculator-shell">
      {children}
    </div>
  );
};

export default CalculatorShell;
/**
 * Input Parsing and Validation Utilities
 */

/**
 * Parse currency input and return number
 * @param {string} value - Input value
 * @returns {number|null} Parsed number or null
 */
export const parseCurrencyInput = (value) => {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned === '') return null;
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
};

/**
 * Parse percentage input and return number
 * @param {string} value - Input value
 * @returns {number|null} Parsed number or null
 */
export const parsePercentageInput = (value) => {
  if (!value) return null;
  const cleaned = value.replace(/[%\s]/g, '');
  if (cleaned === '') return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

/**
 * Parse numeric input and return number
 * @param {string} value - Input value
 * @returns {number|null} Parsed number or null
 */
export const parseNumericInput = (value) => {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned === '') return null;
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
};

/**
 * Validate and clamp value within range
 * @param {number|null} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {number} defaultValue - Default value if invalid
 * @returns {number} Validated value
 */
export const validateRange = (value, min, max, defaultValue) => {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

/**
 * Format number as currency
 * @param {number} value - Value to format
 * @param {boolean} includeDecimals - Whether to include decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, includeDecimals = false) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return '$0';
  
  return `$${parsed.toLocaleString('en-US', { 
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0
  })}`;
};

/**
 * Format number with commas as user types
 * @param {string} value - Input value
 * @returns {string} Formatted value
 */
export const formatInputWithCommas = (value) => {
  const num = parseCurrencyInput(value);
  if (num === null) return '';
  return num.toLocaleString('en-US');
};

/**
 * Download data as CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of file
 */
export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape values that contain commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

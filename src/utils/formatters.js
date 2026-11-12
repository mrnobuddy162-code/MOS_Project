/**
 * Formats an engineering number with appropriate precision and units
 */
export function formatNumber(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '0.00';
  if (Math.abs(val) === 0) return '0.00';
  if (Math.abs(val) < 0.0001) return val.toExponential(2);
  if (Math.abs(val) >= 1000000) return (val / 1000000).toFixed(decimals) + ' M';
  return Number(val.toFixed(decimals)).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatScientific(val, decimals = 3) {
  if (val === null || val === undefined || isNaN(val)) return '0.00';
  return Number(val).toExponential(decimals);
}

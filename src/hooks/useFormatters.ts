export const useFormatters = () => {
  const toNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value as string);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatLargeNumber = (num: string | number): string => {
    const numValue = toNumber(num);
    if (numValue >= 1000000) return (numValue / 1000000).toFixed(1) + 'M';
    if (numValue >= 1000) return (numValue / 1000).toFixed(1) + 'K';
    return numValue.toString();
  };

  const formatTime = (seconds: string | number): string => {
    const numSeconds = toNumber(seconds);
    if (!numSeconds) return '0:00';
    const hours = Math.floor(numSeconds / 3600);
    const minutes = Math.floor((numSeconds % 3600) / 60);
    if (hours === 0 && minutes === 0) return '0:00';
    return `${hours}h ${minutes}m`;
  };

  const formatPercentage = (value: string | number): string => {
    return typeof value === 'number' ? `${value}%` : `${value}`;
  };

  return {
    number: formatLargeNumber,
    time: formatTime,
    percentage: formatPercentage,
    toNumber,
  };
};

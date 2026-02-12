export const validateAmount = (input: string): boolean => {
  // Allow empty string
  if (input === "") return true;

  // Check if valid number with optional decimal
  const regex = /^\d*\.?\d*$/;
  return regex.test(input);
};

export const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const currencyFlags: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  HKD: "🇭🇰",
  MYR: "🇲🇾",
  SGD: "🇸🇬",
  INR: "🇮🇳",
};

export const getFlag = (currencyCode: string): string => {
  return currencyFlags[currencyCode] || "🌍";
};

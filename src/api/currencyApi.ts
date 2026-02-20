import axios from "axios";
import { CurrencyPair, ExchangeRate } from "../types/currency";

const EXCHANGE_API_BASE = "https://open.er-api.com/v6/latest";

// Mock currency pairs
const generateCurrencyPairs = (): CurrencyPair[] => {
  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "INR", name: "Indian Rupee" },
  ];

  const pairs: CurrencyPair[] = [];
  currencies.forEach((source) => {
    currencies.forEach((dest) => {
      if (source.code !== dest.code) {
        pairs.push({
          source_currency_code: source.code,
          source_currency_name: source.name,
          destination_currency_code: dest.code,
          destination_currency_name: dest.name,
        });
      }
    });
  });
  return pairs;
};

export const currencyApi = {
  getCurrencyPairs: async (): Promise<CurrencyPair[]> => {
    return generateCurrencyPairs();
  },

  getExchangeRate: async (
    sourceCurrency: string,
    destinationCurrency: string,
  ): Promise<ExchangeRate> => {
    try {
      const response = await axios.get(
        `${EXCHANGE_API_BASE}/${sourceCurrency}`,
        {
          timeout: 10000,
        },
      );

      if (response.data?.rates && response.data.rates[destinationCurrency]) {
        const rate = response.data.rates[destinationCurrency];
        return {
          source_currency: sourceCurrency, //USD
          destination_currency: destinationCurrency, //EUR
          rate: rate, // 0.92
          date: new Date().toISOString(),
        };
      }

      throw new Error("Exchange rate not found");
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      // Fallback mock rate
      return {
        source_currency: sourceCurrency,
        destination_currency: destinationCurrency,
        rate: 1.0,
        date: new Date().toISOString(),
      };
    }
  },
};

import axios from "axios";
import { CurrencyPair } from "../types/currency.types";

const BASE_URL = "https://www.instarem.com/api/v1/public";

export const fetchCurrencyPairs = async (): Promise<CurrencyPair[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/currency/pair?source_currency=USD-HKD-MYR-SGD-JPY-EUR-GBP-AUD-CAD`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch currency pairs",
      );
    }
    throw new Error("Network error occurred");
  }
};

export const fetchExchangeRate = async (
  sourceCurrency: string,
  destinationCurrency: string,
): Promise<number> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/daily-rates?source_currency=${sourceCurrency}&destination_currency=${destinationCurrency}`,
    );

    // API returns rate in the response
    const rate = response.data?.rate || response.data?.exchange_rate;

    if (!rate) {
      throw new Error("Exchange rate not found in response");
    }

    return parseFloat(rate);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch exchange rate",
      );
    }
    throw new Error("Network error occurred");
  }
};

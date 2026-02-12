export interface Currency {
  code: string;
  name: string;
}

export interface CurrencyPair {
  source_currency_code: string;
  source_currency_name: string;
  destination_currency_code: string;
  destination_currency_name: string;
}

export interface ExchangeRate {
  source_currency: string;
  destination_currency: string;
  rate: number;
  date: string;
}

export interface ConversionHistory {
  id: string;
  sourceCurrency: string;
  destinationCurrency: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: number;
}

export interface CurrencyState {
  currencyPairs: CurrencyPair[];
  sourceCurrencies: Currency[];
  destinationCurrencies: Currency[];
  selectedSource: Currency | null;
  selectedDestination: Currency | null;
  loading: boolean;
  error: string | null;
}

export interface ConversionState {
  amount: string;
  exchangeRate: ExchangeRate | null;
  convertedAmount: number | null;
  history: ConversionHistory[];
  loading: boolean;
  error: string | null;
  cachedRates: Record<string, { rate: number; timestamp: number }>;
}

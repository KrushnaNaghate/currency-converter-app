export interface CurrencyPair {
  source_currency_code: string;
  source_currency_name: string;
  destination_currency_code: string;
  destination_currency_name: string;
}

export interface ExchangeRate {
  source_currency_code: string;
  destination_currency_code: string;
  rate: number;
}

export interface ConversionHistory {
  id: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: number;
  rate: number;
  timestamp: number;
}

export interface CurrencyState {
  pairs: CurrencyPair[];
  sourceCurrency: string;
  destinationCurrency: string;
  exchangeRate: number | null;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  lastFetched: number | null;
}

export interface HistoryState {
  conversions: ConversionHistory[];
}

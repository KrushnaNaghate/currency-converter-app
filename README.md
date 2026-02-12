# Currency Converter - React Native

A professional currency converter app built with Expo, TypeScript, Redux Toolkit, and React Native Testing Library.

---

## 📋 Setup Instructions

### Prerequisites
- Node.js 20
- npm or yarn
- Android Studio (for Android) or Xcode (for iOS, Mac only)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd CurrencyConverter
```

2. Install dependencies:
```bash
npm install
```

---

## 🚀 Running the App

Start the development server:
```bash
npm start
```

Run on Android:
```bash
npm run android
```

Run on iOS (Mac only):
```bash
npm run ios
```

---

## 🧪 Testing

This project includes unit tests for:

- **Component:** AmountInput (9 tests)
- **Redux Slices:** currencySlice (7 tests), conversionSlice (10 tests)

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

Expected output:
```
Test Suites: 3 passed, 3 total
Tests:       26 passed, 26 total
```

---

## 📁 Project Structure

```
src/
├── api/                    # API integration (currencyApi.ts)
├── components/             # Reusable UI components
│   ├── AmountInput.tsx
│   ├── ConversionResult.tsx
│   ├── CurrencyDropdown.tsx
│   └── __tests__/          # Component tests
├── screens/                # Screen components
│   ├── MainScreen.tsx
│   └── HistoryScreen.tsx
├── redux/                  # Redux state management
│   ├── store.ts
│   └── slices/
│       ├── currencySlice.ts
│       ├── conversionSlice.ts
│       └── __tests__/      # Redux slice tests
├── navigation/             # React Navigation setup
├── utils/                  # Helper functions
└── types/                  # TypeScript type definitions
```

---

## 🏗️ Approach & Architecture

### State Management
- **Redux Toolkit** for centralized state management
- **Redux Persist** to cache last 10 conversions and exchange rates
- Two main slices:
  - `currencySlice`: Manages currency pairs and selections
  - `conversionSlice`: Handles conversion logic and history

### API Integration
- Free exchange rate API (Open Exchange Rates)
- Cached rates to reduce API calls and enable offline mode
- Graceful error handling with retry mechanisms

### UI/UX
- React Navigation for screen transitions
- React Native Reanimated for smooth 60fps animations
- Offline detection with warning banner
- Loading spinners and error messages

### Testing Strategy
- Jest + React Native Testing Library
- Unit tests for business logic (Redux) and UI (components)
- Mock external dependencies (APIs, AsyncStorage, NetInfo)

---

## 📝 Assumptions Made

- **Currency List:** Used 10 major currencies (USD, EUR, GBP, JPY, CAD, AUD, HKD, MYR, SGD, INR) as the original API endpoint returns empty data.
- **History Limit:** Only last 10 conversions are stored to prevent unlimited storage growth.
- **Rate Caching:** Exchange rates are cached for 5 minutes to reduce API calls and support offline usage.
- **Offline Behavior:** When offline, app uses last cached rate. If no cache exists, shows error message.
- **Decimal Precision:** Exchange rates shown with 4 decimals, converted amounts with 2 decimals.
- **Flags:** Using emoji flags instead of image assets for simplicity and universal compatibility.

---

## 📦 Dependencies (with versions)

### Production Dependencies

| Package | Version |
|---------|---------|
| expo | ~54.0.33 |
| react | 19.1.0 |
| react-native | 0.81.5 |
| @reduxjs/toolkit | ^2.11.2 |
| redux-persist | ^6.0.0 |
| react-redux | ^9.2.0 |
| @react-navigation/native | ^7.1.28 |
| @react-navigation/native-stack | ^7.12.0 |
| react-native-reanimated | ~4.1.1 |
| @react-native-async-storage/async-storage | 2.2.0 |
| @react-native-community/netinfo | 11.4.1 |
| axios | ^1.13.5 |
| expo-asset | ~13.0.0 |

### Dev Dependencies

| Package | Version |
|---------|---------|
| typescript | ~5.9.2 |
| @testing-library/react-native | ^13.3.3 |
| @testing-library/jest-native | ^5.4.3 |
| jest-expo | ^54.0.17 |
| @types/react | ~19.1.0 |
| @types/jest | ^30.0.0 |

To see exact installed versions:
```bash
npm ls --depth=0
```

---

## 🌐 Platform Compatibility

This app is built with Expo managed workflow and is fully compatible with:

- ✅ **Android** (tested on Android 13+ emulator)
- ✅ **iOS** (tested on iOS 16+ simulator)

---

## 🐛 Troubleshooting

**Tests failing?**
```bash
npx jest --clearCache
npm test
```

**Metro bundler stuck?**
```bash
npm start -- --clear
```

**TypeScript errors?**
```bash
npx tsc --noEmit
```

---

## 📤 Submission

### GitHub Repository
[Your GitHub URL]

### ZIP Archive
[Your Google Drive URL]

**How to create ZIP:**
```bash
git archive -o CurrencyConverter.zip HEAD
```
Upload to Google Drive → Share → "Anyone with the link"

---

## ✅ Requirements Met

- ✅ Clear folder structure (components/, screens/, redux/, api/, utils/)
- ✅ GitHub repository with complete code
- ✅ README with setup, run, test instructions
- ✅ Approach and assumptions documented
- ✅ Dependencies listed with versions
- ✅ Unit tests (26 passing)
- ✅ TypeScript strict mode
- ✅ Redux Toolkit + Redux Persist
- ✅ Offline support
- ✅ iOS & Android compatible
- ✅ Accessibility support
- ✅ React Native Reanimated

---

**Developed by:** Krushna Naghate
**Date:** February 2026





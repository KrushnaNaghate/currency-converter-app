# 💱 Currency Converter - React Native Mobile App

> **Assignment Submission** - Professional currency converter app demonstrating React Native, TypeScript, Redux Toolkit, and modern mobile development best practices.

![Tests](https://img.shields.io/badge/tests-26%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#️-installation--setup)
- [Running the App](#-running-the-app)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Architecture & Approach](#-architecture--approach)
- [API Integration](#-api-integration)
- [State Management](#-state-management)
- [Assumptions Made](#-assumptions-made)
- [Dependencies](#-dependencies)
- [Troubleshooting](#-troubleshooting)
- [Submission Details](#-submission-details)

---

## ✨ Features

### Core Features (Required)
- ✅ **Real-time Currency Conversion** - 10 major currencies with live exchange rates
- ✅ **Two Screen Navigation** - Main converter + History screen
- ✅ **Searchable Currency Dropdowns** - Filter by code or name
- ✅ **Country Flags** - Emoji flags for all currencies
- ✅ **Swap Button** - Instant source ↔ destination swap
- ✅ **Conversion History** - Last 10 conversions persisted
- ✅ **Offline Support** - Works offline with cached rates + warning banner
- ✅ **Input Validation** - Numeric only with decimal support
- ✅ **Error Handling** - User-friendly messages + retry buttons
- ✅ **Loading States** - Smooth animated spinners
- ✅ **Redux Toolkit** - Complete state management
- ✅ **Redux Persist** - History + rates cached across restarts
- ✅ **TypeScript** - 100% type coverage with strict mode
- ✅ **Unit Tests** - 26 passing tests (Jest + RNTL)
- ✅ **Accessibility** - Screen reader labels + proper touch targets

### Bonus Features
- ✅ **React Native Reanimated** - 60fps animations (swap button, fade-ins)
- ✅ **Pull to Refresh** - Update exchange rates
- ✅ **Quick Amount Buttons** - Tap 10/50/100/500 for fast conversion

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | SDK 54 | React Native development platform |
| **React Native** | 0.81.5 | Mobile UI framework |
| **TypeScript** | 5.9.2 | Type safety |
| **Redux Toolkit** | 2.11.2 | State management |
| **Redux Persist** | 6.0.0 | State persistence (AsyncStorage) |
| **React Navigation** | 7.x | Screen navigation |
| **React Native Reanimated** | 4.1.1 | Smooth 60fps animations |
| **Axios** | 1.13.5 | HTTP client for API calls |
| **NetInfo** | 11.4.1 | Network connectivity detection |
| **Jest** | (via jest-expo) | Testing framework |
| **React Native Testing Library** | 13.3.3 | Component testing utilities |
| **@expo/vector-icons** | (via Expo) | Material Design icons |

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git**
- **iOS Simulator** (Mac only) or **Android Emulator**

### Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd CurrencyConverter

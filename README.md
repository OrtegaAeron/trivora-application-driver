# Trivora Application - Driver

A React Native mobile application for drivers built with Expo, TypeScript, and MapLibre for location-based services.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technologies](#technologies)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) or **yarn** - comes with Node.js
- **Expo CLI** - for development and testing
- **Git** - for cloning the repository
- **iOS Simulator** (macOS) or **Android Emulator** (Windows/Mac/Linux) - for local testing
- **Expo Go App** - available on [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) - for scanning QR code and testing on physical devices

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/OrtegaAeron/trivora-application-driver.git
cd trivora-application-driver
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Install Expo CLI (if not already installed)

```bash
npm install -g expo-cli
```

## Setup

### 1. Environment Configuration

If your project requires environment variables, create a `.env` file in the root directory:

```bash
# .env
# Add any required environment variables here
```

### 2. Install Development Client (Optional)

For enhanced development experience with Expo dev client:

```bash
npx expo install expo-dev-client
```

### 3. Verify Installation

Check that TypeScript is properly configured:

```bash
npx tsc --version
```

## Running the Application

### Option 1: Start Expo Development Server

```bash
npm start
# or
yarn start
```

This will display a QR code in the terminal that you can scan with:
- **Expo Go App** on your phone (iOS or Android)
- **iOS Simulator** by pressing `i`
- **Android Emulator** by pressing `a`
- **Web** by pressing `w`

### Option 2: Run on iOS (macOS only)

```bash
npm run ios
# or
yarn ios
```

### Option 3: Run on Android

```bash
npm run android
# or
yarn android
```

### Option 4: Run on Web

```bash
npm run web
# or
yarn web
```

## Project Structure

```
trivora-application-driver/
├── App.ts                           # Main entry point
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── index.ts                         # Application index
└── [other source files]             # Application components and modules
```

## Technologies

This project is built with the following technologies:

- **React Native** (v0.81.5) - Cross-platform mobile app framework
- **TypeScript** (v5.9.2) - Type-safe JavaScript
- **Expo** (v54.0.36) - React Native framework and platform
- **React Navigation** - Navigation library for mobile apps
- **MapLibre React Native** (v11.3.6) - Mapping and location services
- **React Native Paper** (v4.9.2) - Material Design UI components
- **Expo Location** - Geolocation services
- **Expo Font** - Custom font management

## Development Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser

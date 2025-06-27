# Video streamer

A video streamer app built with React Native and Expo, featuring fullscreen playback and a robust comment system. State management is handled with Zustand, and the codebase is designed to be clean, professional, and well-tested.

## Features

- Browse, watch, and track progress on videos
- Fullscreen video playback
- Dark theme with modern UI
- Add, edit, and view comments on videos
- Comment edit window (1 hour for your own comments)
- Track watched and in-progress videos
- Profile and watched videos tabs
- State persistence with AsyncStorage
- Robust unit and integration tests (Jest + React Native Testing Library)

## Screenshots

![Video Streamer App Screenshot](assets/images/Screenshot%202025-06-27%20at%2010.00.59.png)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```bash
  npm install -g expo-cli
  ```
- (Optional) Xcode (for iOS) or Android Studio (for Android)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nennyfills/VS.git
   cd VS
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```

### Running the App

#### ⚠️ Note: The app cannot run on Expo Go

This project uses `react-native-video`, which requires native code. You **must** use a development build or a custom client.

#### On a Real Device (Development Build)

- Enable Developer Mode and USB Debugging on your IOS/Android device.
- Connect your device to your computer via USB.
- Make sure your computer can see your device (you may need to accept a prompt on your phone).

Use the provided scripts for convenience:

- **For iOS device:**
  ```bash
  pnpm run real:device:ios
  ```
- **For Android device:**
  ```bash
  pnpm run real:device:android
  ```
- **Start the dev server for your custom client:**
  ```bash
  pnpm run real:device:start
  ```

#### On Simulator/Emulator

- **iOS Simulator:**
  ```bash
  pnpm run ios
  ```
- **Android Emulator:**
  ```bash
  pnpm run android
  ```

#### EAS Build (Cloud build for distribution)

- **For iOS:**
  ```bash
  pnpm run eas:ios
  ```
- **For Android:**
  ```bash
  pnpm run eas:android
  ```

### Testing

Run all tests:

```bash
pnpm test

pnpm test:watch
```

- Tests use Jest and React Native Testing Library
- Store logic is tested directly, and components are tested with mocks where appropriate

### Project Structure

```
VS/
  app/            # App screens and navigation
  components/     # Reusable UI components
  container/      # Container components (logic + UI)
  data/           # Mock data and user info
  hooks/          # Custom React hooks
  stores/         # Zustand stores
  types/          # TypeScript types
  assets/         # Images and static assets
```

### Customization

- Update `data/mockVideos.ts` to change the video list
- Update `data/currentUSer.ts` for user info
- Edit styles in component files for theming

### Troubleshooting

- For device connection issues, try `pnpm run real:device:start -- --tunnel`
- For native errors, ensure you have the correct Xcode/Android Studio setup

### License

MIT

---

**Made with ❤️ using Expo, React Native, and Zustand.**

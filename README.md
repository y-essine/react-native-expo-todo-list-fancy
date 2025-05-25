# Fancy Tasks - Todo List App ✨

A beautiful and modern todo list app built with React Native and Expo SDK 53. Features a sleek design with dark/light mode support, smooth animations, and intuitive gestures.

## Features

- ✅ **Add, toggle, and delete tasks** with smooth animations
- 🌓 **Dark/Light mode support** with automatic system detection
- 📱 **Beautiful UI** with gradient backgrounds and blur effects
- 🎯 **Task filtering** (All, Active, Completed)
- 📊 **Task statistics** with visual progress indicators
- 👆 **Swipe gestures** to delete tasks
- 🎪 **Haptic feedback** for better user experience
- 🚀 **Performance optimized** with React hooks

## Technology Stack

- **React Native** 0.79.2
- **Expo SDK** 53
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **React Native Gesture Handler** for touch interactions
- **Expo Linear Gradient** for beautiful backgrounds
- **Expo Blur** for modern UI effects

## Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Project Structure

```
├── app/
│   ├── index.tsx          # Main todo app screen
│   └── _layout.tsx        # Root layout configuration
├── assets/
│   └── images/           # App icons and images
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## Development

The app is built with Expo Router using file-based routing. The main todo functionality is contained in `app/index.tsx` with a clean, single-screen design.

### Key Components

- **TodoApp**: Main container with state management
- **TodoItem**: Individual task component with animations
- **BlurCard**: Reusable card component with blur effects
- **FilterButton**: Task filter controls
- **AddTaskButton**: Floating action button for adding tasks

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

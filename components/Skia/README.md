# Skia Path Animation System

A flexible system for creating and animating SVG-based paths using React Native Skia.

## Folder Structure

```
components/Skia/
├── OnboardingPath.tsx          # Main animated path component
├── PathDemo.tsx               # Interactive demo component
├── UsageExamples.tsx          # Usage examples and documentation
└── paths/
    ├── index.ts              # Path registry and type definitions
    ├── WavePath.ts           # Original wave path
    ├── CirclePath.ts         # Simple circle path
    ├── SpiralPath.ts         # Spiral animation path
    ├── Onboard1Path.ts       # SVG-based path from onboard-1-1.svg
    └── Onboard2Path.ts       # SVG-based path from onboard-1-2.svg

utils/
├── svgToSkiaPath.ts          # Utility to convert SVG paths to Skia paths
└── createOnboardingPath.ts   # Original path creation utility
```

## Features

- ✅ Multiple path types with different animations
- ✅ Automatic SVG path conversion to Skia paths
- ✅ Configurable animation duration and stroke width
- ✅ Auto-play and manual control options
- ✅ Animation completion callbacks
- ✅ Dynamic path switching
- ✅ Responsive scaling based on screen dimensions

## Available Path Types

| Type       | Description           | Duration | Stroke Width |
| ---------- | --------------------- | -------- | ------------ |
| `wave`     | Original wave path    | 3000ms   | 4px          |
| `circle`   | Simple circle         | 2000ms   | 3px          |
| `onboard1` | First onboarding SVG  | 4000ms   | 5px          |
| `onboard2` | Second onboarding SVG | 3500ms   | 5px          |
| `spiral`   | Spiral animation      | 2500ms   | 3px          |

## Basic Usage

```tsx
import { Canvas } from "@shopify/react-native-skia";
import OnboardingPath from "./components/Skia/OnboardingPath";

<Canvas style={{ flex: 1 }}>
  <OnboardingPath color="#58B3B3" pathType="onboard1" />
</Canvas>;
```

## Adding New Paths

### 1. Create a new path file

```typescript
// components/Skia/paths/MyCustomPath.ts
import { Skia, SkPath } from "@shopify/react-native-skia";

export const createMyCustomPath = (width: number, height: number): SkPath => {
  const path = Skia.Path.Make();
  // Add your path logic here
  return path;
};
```

### 2. Add to the path registry

```typescript
// components/Skia/paths/index.ts
import { createMyCustomPath } from "./MyCustomPath";

export type PathType =
  | "wave"
  | "circle"
  | "onboard1"
  | "onboard2"
  | "spiral"
  | "myCustom";

export const pathRegistry: Record<PathType, PathConfig> = {
  // ...existing paths...
  myCustom: {
    name: "My Custom Path",
    createPath: createMyCustomPath,
    duration: 3000,
    strokeWidth: 4,
  },
};
```

### 3. Use the new path

```tsx
<OnboardingPath color="#FF6B6B" pathType="myCustom" />
```

## Adding SVG-Based Paths

### 1. Extract path data from your SVG file

```xml
<!-- Your SVG file -->
<svg viewBox="0 0 100 100">
  <path d="M10,10 L90,10 L90,90 L10,90 Z" />
</svg>
```

### 2. Create the path component

```typescript
// components/Skia/paths/MySvgPath.ts
import { svgToSkiaPath } from "@/utils/svgToSkiaPath";

const MY_SVG_PATH = "M10,10 L90,10 L90,90 L10,90 Z";

export const createMySvgPath = (width: number, height: number): SkPath => {
  return svgToSkiaPath(MY_SVG_PATH, width, height);
};
```

## Animation Control

### Auto-play (default)

```tsx
<OnboardingPath color="#58B3B3" pathType="wave" />
```

### Manual control

```tsx
<OnboardingPath color="#58B3B3" pathType="wave" autoPlay={false} />
```

### With completion callback

```tsx
<OnboardingPath
  color="#58B3B3"
  pathType="wave"
  onAnimationComplete={() => {
    console.log("Animation completed!");
  }}
/>
```

## Demo Component

Use the `PathDemo` component to test all available paths:

```tsx
import PathDemo from "./components/Skia/PathDemo";

<PathDemo />;
```

This provides an interactive interface to cycle through different path types and control playback.

## Technical Details

### Animation Phases

1. **Drawing Phase (0→1)**: Path draws from start to end
2. **Wait Phase**: 1-second pause with full path visible
3. **Erasing Phase (1→2)**: Path erases from start to end
4. **Wait Phase**: 1-second pause with no path visible
5. **Loop**: Repeats indefinitely (when autoPlay is true)

### Path Scaling

All paths automatically scale to fit the provided width and height while maintaining their aspect ratio.

### Performance

- Paths are created once and cached until dimensions change
- Animations use React Native Reanimated for 60fps performance
- SVG parsing happens once during path creation

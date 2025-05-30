# MovableText3D Component

A 3D interactive text component for React Native Skia that responds to touch gestures with realistic physics-based animations.

## Features

- ✅ Touch and drag to rotate text in 3D space
- ✅ Percentage-based positioning and scaling relative to canvas size
- ✅ Configurable physics (damping, stiffness, mass)
- ✅ Customizable rotation limits
- ✅ Smooth spring animations with momentum
- ✅ Perspective effects and depth-based opacity
- ✅ Support for custom fonts

## Installation

Make sure you have the required dependencies:

```bash
npm install @shopify/react-native-skia react-native-gesture-handler react-native-reanimated
```

## Basic Usage

```tsx
import { Canvas } from "@shopify/react-native-skia";
import MovableText3D from "@/components/Skia/MovableText3D";

<Canvas style={{ flex: 1 }}>
  <MovableText3D
    text="Hello 3D!"
    color="#f8d057"
    fontSize={48}
    xPercent={50}
    yPercent={50}
  />
</Canvas>;
```

## Props

### Required Props

| Prop   | Type     | Description         |
| ------ | -------- | ------------------- |
| `text` | `string` | The text to display |

### Optional Props

| Prop           | Type     | Default     | Description                                       |
| -------------- | -------- | ----------- | ------------------------------------------------- |
| `fontSize`     | `number` | `48`        | Font size in pixels                               |
| `color`        | `string` | `"#FFFFFF"` | Text color                                        |
| `fontPath`     | `string` | `undefined` | Path to custom font file                          |
| `xPercent`     | `number` | `50`        | X position as percentage of canvas width (0-100)  |
| `yPercent`     | `number` | `50`        | Y position as percentage of canvas height (0-100) |
| `scalePercent` | `number` | `100`       | Scale as percentage (100 = normal size)           |
| `damping`      | `number` | `10`        | Spring damping (lower = more bouncy)              |
| `stiffness`    | `number` | `150`       | Spring stiffness (higher = faster spring)         |
| `mass`         | `number` | `1`         | Spring mass (higher = heavier/slower)             |
| `maxRotationX` | `number` | `30`        | Maximum rotation around X-axis in degrees         |
| `maxRotationY` | `number` | `30`        | Maximum rotation around Y-axis in degrees         |
| `perspective`  | `number` | `300`       | 3D perspective distance                           |

## Positioning Guide

### Percentage-based Positioning

The component uses percentage-based positioning for responsive layouts:

```tsx
// Center of canvas
<MovableText3D xPercent={50} yPercent={50} />

// Top-left corner
<MovableText3D xPercent={10} yPercent={10} />

// Top-right corner
<MovableText3D xPercent={90} yPercent={10} />

// Bottom-center
<MovableText3D xPercent={50} yPercent={90} />
```

### Scaling

```tsx
// Half size
<MovableText3D scalePercent={50} />

// Normal size
<MovableText3D scalePercent={100} />

// Double size
<MovableText3D scalePercent={200} />
```

## Physics Configuration

### Bouncy Animation

```tsx
<MovableText3D damping={5} stiffness={300} mass={0.5} />
```

### Smooth Animation

```tsx
<MovableText3D damping={25} stiffness={100} mass={2} />
```

### Snappy Animation

```tsx
<MovableText3D damping={8} stiffness={400} mass={0.8} />
```

## Advanced Examples

### Multiple Texts with Different Physics

```tsx
<Canvas style={{ flex: 1 }}>
  {/* Title */}
  <MovableText3D
    text="Welcome"
    fontSize={64}
    color="#f8d057"
    xPercent={50}
    yPercent={20}
    scalePercent={120}
    damping={15}
    stiffness={200}
    maxRotationX={45}
    maxRotationY={45}
  />

  {/* Subtitle */}
  <MovableText3D
    text="Touch & Drag"
    fontSize={32}
    color="#4ECDC4"
    xPercent={50}
    yPercent={40}
    scalePercent={80}
    damping={10}
    stiffness={150}
  />
</Canvas>
```

### Corner Positioned Elements

```tsx
<Canvas style={{ flex: 1 }}>
  <MovableText3D text="TL" xPercent={15} yPercent={15} color="#FF6B6B" />
  <MovableText3D text="TR" xPercent={85} yPercent={15} color="#4ECDC4" />
  <MovableText3D text="BL" xPercent={15} yPercent={85} color="#45B7D1" />
  <MovableText3D text="BR" xPercent={85} yPercent={85} color="#96CEB4" />
</Canvas>
```

## Integration with Other Skia Components

```tsx
import { Canvas, Fill } from "@shopify/react-native-skia";
import OnboardingPath from "@/components/Skia/OnboardingPath";
import MovableText3D from "@/components/Skia/MovableText3D";

<Canvas style={{ flex: 1 }}>
  <Fill color="#3C3549" />

  {/* Animated paths */}
  <OnboardingPath
    color="#f8d057"
    pathType="onboard1"
    scaleX={1.2}
    x={-50}
    y={0}
  />

  {/* Interactive 3D text */}
  <MovableText3D
    text="Interactive UI"
    color="#4ECDC4"
    fontSize={48}
    xPercent={50}
    yPercent={30}
  />
</Canvas>;
```

## Performance Tips

1. **Limit the number of 3D texts**: Each component adds gesture handling overhead
2. **Optimize font loading**: Use system fonts when possible for better performance
3. **Adjust physics values**: Lower stiffness values reduce computation load
4. **Consider rotation limits**: Smaller rotation ranges improve performance

## Troubleshooting

### Text not appearing

- Ensure the Canvas has proper dimensions
- Check that xPercent and yPercent values are within 0-100
- Verify font loading if using custom fonts

### Gestures not working

- Make sure `react-native-gesture-handler` is properly set up
- Check that the Canvas is receiving touch events
- Verify GestureHandlerRootView is wrapping your app

### Performance issues

- Reduce the number of simultaneous 3D text components
- Lower physics values (stiffness, damping)
- Use smaller fonts when possible

## Examples

See `MovableText3DExamples.tsx` for complete usage examples including:

- Simple 3D text
- Multiple texts with different positions
- Corner positioning
- Physics variations

## Dependencies

- `@shopify/react-native-skia`: Skia rendering
- `react-native-gesture-handler`: Touch gesture handling
- `react-native-reanimated`: Smooth animations

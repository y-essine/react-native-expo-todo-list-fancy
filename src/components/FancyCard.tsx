import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type FancyCardProps = {
  children: React.ReactNode;
  style?: any;
  darkMode?: boolean;
  variant?: 'default' | 'warm' | 'cool' | 'electric';
};

export const FancyCard = ({ children, style, darkMode = false, variant = 'default' }: FancyCardProps) => {
  // Animation values for the two light points
  const lightPoint1X = useSharedValue(0);
  const lightPoint1Y = useSharedValue(0);
  const lightPoint2X = useSharedValue(0);
  const lightPoint2Y = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Generate stable animation parameters for each card instance
  const animationParams = useMemo(() => {
    // Use a simple hash based on variant and darkMode to pick variation
    const hashString = `${variant}-${darkMode}`;
    const hash = hashString.length % 4; // Simple hash to pick variation
    
    const variations = [
      { radius1: 320, radius2: 280, xDur1: 8000, yDur1: 6000, xDur2: 10000, yDur2: 7000 },
      { radius1: 340, radius2: 300, xDur1: 9000, yDur1: 7000, xDur2: 11000, yDur2: 8000 },
      { radius1: 360, radius2: 320, xDur1: 10000, yDur1: 8000, xDur2: 12000, yDur2: 9000 },
      { radius1: 380, radius2: 340, xDur1: 11000, yDur1: 9000, xDur2: 13000, yDur2: 10000 },
    ];
    
    const variation = variations[hash];
    
    return {
      point1: {
        radius: variation.radius1,
        xDuration: variation.xDur1,
        yDuration: variation.yDur1,
        xRange: [10, 90] as [number, number],
        yRange: [20, 80] as [number, number],
        rotationSpeed: 20000,
      },
      point2: {
        radius: variation.radius2,
        xDuration: variation.xDur2,
        yDuration: variation.yDur2,
        xRange: [80, 20] as [number, number],
        yRange: [10, 70] as [number, number],
        rotationSpeed: 25000,
      },
    };
  }, [variant, darkMode]);  
  // Color schemes for different variants
  const colorSchemes = {
    default: {
      light1: [
        'rgba(20, 184, 166, 0.4)', // teal-500
        'rgba(45, 212, 191, 0.3)', // teal-400
        'rgba(94, 234, 212, 0.2)', // teal-300
        'rgba(153, 246, 228, 0.1)', // teal-200
      ] as const,
      light2: [
        'rgba(147, 51, 234, 0.4)', // purple-600
        'rgba(168, 85, 247, 0.3)', // purple-500
        'rgba(196, 181, 253, 0.2)', // purple-300
        'rgba(221, 214, 254, 0.1)', // purple-200
      ] as const,
    },
    warm: {
      light1: [
        'rgba(251, 146, 60, 0.4)', // orange-400
        'rgba(253, 186, 116, 0.3)', // orange-300
        'rgba(254, 215, 170, 0.2)', // orange-200
        'rgba(255, 237, 213, 0.1)', // orange-100
      ] as const,
      light2: [
        'rgba(244, 63, 94, 0.4)', // rose-500
        'rgba(251, 113, 133, 0.3)', // rose-400
        'rgba(253, 164, 175, 0.2)', // rose-300
        'rgba(254, 205, 211, 0.1)', // rose-200
      ] as const,
    },
    cool: {
      light1: [
        'rgba(59, 130, 246, 0.4)', // blue-500
        'rgba(96, 165, 250, 0.3)', // blue-400
        'rgba(147, 197, 253, 0.2)', // blue-300
        'rgba(191, 219, 254, 0.1)', // blue-200
      ] as const,
      light2: [
        'rgba(16, 185, 129, 0.4)', // emerald-500
        'rgba(52, 211, 153, 0.3)', // emerald-400
        'rgba(110, 231, 183, 0.2)', // emerald-300
        'rgba(167, 243, 208, 0.1)', // emerald-200
      ] as const,
    },
    electric: {
      light1: [
        'rgba(236, 72, 153, 0.4)', // pink-500
        'rgba(244, 114, 182, 0.3)', // pink-400
        'rgba(249, 168, 212, 0.2)', // pink-300
        'rgba(252, 207, 227, 0.1)', // pink-200
      ] as const,
      light2: [
        'rgba(139, 92, 246, 0.4)', // violet-500
        'rgba(167, 139, 250, 0.3)', // violet-400
        'rgba(196, 181, 253, 0.2)', // violet-300
        'rgba(221, 214, 254, 0.1)', // violet-200
      ] as const,
    },  };

  // Generate static grain pattern to avoid re-renders
  const grainPattern = useMemo(() => {
    // Use predefined positions to avoid Math.random() during render
    const positions = [
      { left: 15, top: 25, opacity: 0.2 },
      { left: 45, top: 60, opacity: 0.15 },
      { left: 75, top: 30, opacity: 0.25 },
      { left: 25, top: 80, opacity: 0.1 },
      { left: 85, top: 15, opacity: 0.3 },
      { left: 55, top: 40, opacity: 0.2 },
      { left: 10, top: 70, opacity: 0.15 },
      { left: 90, top: 55, opacity: 0.25 },
      { left: 35, top: 10, opacity: 0.2 },
      { left: 65, top: 85, opacity: 0.15 },
      { left: 20, top: 45, opacity: 0.3 },
      { left: 80, top: 75, opacity: 0.1 },
      { left: 50, top: 20, opacity: 0.25 },
      { left: 40, top: 90, opacity: 0.2 },
      { left: 70, top: 35, opacity: 0.15 },
    ];
    return positions.map((pos, i) => ({ key: i, ...pos }));
  }, []);

  const currentScheme = colorSchemes[variant];

  useEffect(() => {
    // Start animations immediately with simpler, more stable parameters
    lightPoint1X.value = withRepeat(
      withTiming(1, { 
        duration: animationParams.point1.xDuration, 
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
    lightPoint1Y.value = withRepeat(
      withTiming(1, { 
        duration: animationParams.point1.yDuration, 
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );

    lightPoint2X.value = withRepeat(
      withTiming(1, { 
        duration: animationParams.point2.xDuration, 
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
    lightPoint2Y.value = withRepeat(
      withTiming(1, { 
        duration: animationParams.point2.yDuration, 
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );

    rotation.value = withRepeat(
      withTiming(360, { 
        duration: animationParams.point1.rotationSpeed, 
        easing: Easing.linear 
      }),
      -1,
      false
    );  }, [animationParams]);

  // Animated styles for the light points
  const lightPoint1Style = useAnimatedStyle(() => {
    const x = interpolate(lightPoint1X.value, [0, 1], animationParams.point1.xRange);
    const y = interpolate(lightPoint1Y.value, [0, 1], animationParams.point1.yRange);
    
    return {
      position: 'absolute',
      width: animationParams.point1.radius,
      height: animationParams.point1.radius,
      borderRadius: animationParams.point1.radius / 2,
      left: `${x}%`,
      top: `${y}%`,
      transform: [
        { translateX: -animationParams.point1.radius / 2 },
        { translateY: -animationParams.point1.radius / 2 },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const lightPoint2Style = useAnimatedStyle(() => {
    const x = interpolate(lightPoint2X.value, [0, 1], animationParams.point2.xRange);
    const y = interpolate(lightPoint2Y.value, [0, 1], animationParams.point2.yRange);
    
    return {
      position: 'absolute',
      width: animationParams.point2.radius,
      height: animationParams.point2.radius,
      borderRadius: animationParams.point2.radius / 2,
      left: `${x}%`,
      top: `${y}%`,
      transform: [
        { translateX: -animationParams.point2.radius / 2 },
        { translateY: -animationParams.point2.radius / 2 },
        { rotate: `${-rotation.value * 0.7}deg` },
      ],
    };
  });

  return (
    <View style={[{ borderRadius: 24, overflow: 'hidden' }, style]}>
      {/* Background with light points */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,        backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
      }}>
        {/* First animated light point - Dynamic gradient */}
        <Animated.View style={lightPoint1Style}>
          <LinearGradient
            colors={currentScheme.light1}
            style={{
              flex: 1,
              borderRadius: animationParams.point1.radius / 2,
            }}
          />        </Animated.View>

        {/* Second animated light point - Dynamic gradient */}
        <Animated.View style={lightPoint2Style}>
          <LinearGradient
            colors={currentScheme.light2}
            style={{
              flex: 1,
              borderRadius: animationParams.point2.radius / 2,
            }}
          />        </Animated.View>

        {/* Grainy noise overlay - using a pattern to simulate grain */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: darkMode 
            ? 'rgba(15, 23, 42, 0.2)' 
            : 'rgba(248, 250, 252, 0.2)',
          opacity: 0.6,
        }} />
      </View>      {/* Blur overlay */}
      <BlurView 
        intensity={darkMode ? 120 : 140} 
        tint={darkMode ? 'dark' : 'light'} 
        style={{ 
          flex: 1,
          borderRadius: 24,
        }}
      >
        {/* Grain effect on top of blur */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          opacity: 0.5,
          borderRadius: 24,
          zIndex: 1,
        }}>
          {/* Create a static dotted pattern for grain effect */}
          {grainPattern.map((dot) => (
            <View
              key={dot.key}
              style={{
                position: 'absolute',
                width: 2,
                height: 2,
                backgroundColor: darkMode ? '#94a3b8' : '#64748b',
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                opacity: dot.opacity,
                borderRadius: 1,
              }}
            />
          ))}        </View>

        {/* Content container */}
        <View style={{
          backgroundColor: darkMode 
            ? 'rgba(30, 41, 59, 0.4)' 
            : 'rgba(255, 255, 255, 0.3)', 
          padding: 20,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: darkMode 
            ? 'rgba(148, 163, 184, 0.1)' 
            : 'rgba(148, 163, 184, 0.2)',
          // Add subtle inner shadow effect
          shadowColor: darkMode ? '#000' : '#64748b',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

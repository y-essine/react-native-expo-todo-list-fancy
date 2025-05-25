import { BlurView } from 'expo-blur';
import React from 'react';
import { View } from 'react-native';

type BlurCardProps = {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  darkMode?: boolean;
};

export const BlurCard = ({ children, style, intensity = 80, darkMode = false }: BlurCardProps) => (
  <BlurView 
    intensity={intensity} 
    tint={darkMode ? 'dark' : 'light'} 
    style={[{ borderRadius: 24, overflow: 'hidden' }, style]}
  > 
    <View style={{ 
      backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.1)', 
      padding: 20 
    }}>
      {children}
    </View>
  </BlurView>
);

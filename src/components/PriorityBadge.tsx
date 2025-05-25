import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text } from 'react-native';
import { priorities } from '../theme';
import { Priority } from '../types';

type PriorityBadgeProps = {
  priority: Priority;
  compact?: boolean;
};

export const PriorityBadge = ({ priority, compact = false }: PriorityBadgeProps) => {
  return (
    <LinearGradient
      colors={priorities[priority]}
      style={{
        paddingHorizontal: compact ? 6 : 8,
        paddingVertical: compact ? 2 : 4,
        borderRadius: compact ? 8 : 12,
        marginLeft: compact ? 0 : 8,
      }}
    >
      <Text style={{ 
        color: 'white', 
        fontSize: compact ? 9 : 10, 
        fontWeight: '600' 
      }}>
        {priority.toUpperCase()}
      </Text>
    </LinearGradient>
  );
};

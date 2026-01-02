// Simple default avatar for fallback (white background, gray circle)
import React from 'react';
import { View } from 'react-native';

export default function DefaultAvatar({ size = 80 }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* You can add an icon or initials here if desired */}
    </View>
  );
}

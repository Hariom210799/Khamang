import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CardButton = ({ onPress, title, style, textStyle, ...props }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]} {...props}>
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#FEA12E',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CardButton;

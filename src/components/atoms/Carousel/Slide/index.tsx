import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

export const Slide = (props) => {
  const {title, thumbnail} = props;

  return (
    <View style={{...styles.slide, borderRadius: 10}}>
      <Image
        style={{
          ...styles.slide,
          opacity: 0.3,
          backgroundColor: 'black',
          padding: 20,
          borderRadius: 10,
        }}
        source={thumbnail}
      />
      <Text style={{...styles.slideText}}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flexBasis: '100%',
    flex: 1,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  slideText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
  },
});

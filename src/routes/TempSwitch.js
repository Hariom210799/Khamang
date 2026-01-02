import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, ScrollView} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Toggle,
  Button,
} from '@ui-kitten/components';

export default ({navigation}) => {
  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
  const {width: screenWidth} = Dimensions.get('window');

  const handleClickMaker = () => {
    if (navigation) {
      try {
        navigation.navigate('MakerTabNavigator');
      } catch (e) {
        console.error('Navigation error:', e);
      }
    }
  };
  const handleClickUser = () => {
    if (navigation) {
      try {
        navigation.navigate('UserTabNavigator');
      } catch (e) {
        console.error('Navigation error:', e);
      }
    }
  };

  return (
    <Layout style={styles.container}>
      <Divider />
      <Layout
        style={{
          flex: 1,
          //   justifyContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Text category="h1">Temporary Switch.</Text>

        <Button onPress={handleClickMaker} status="danger">
          Food Maker
        </Button>
        <Button onPress={handleClickUser} status="info">
          User
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

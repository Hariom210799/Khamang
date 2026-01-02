import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../../screens/MakerScreens/home';

const Stack = createStackNavigator();

export default function InboxNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="InboxScreen">
      <Stack.Screen name="InboxScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

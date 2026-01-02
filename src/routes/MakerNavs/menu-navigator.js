import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MenuScreen from '../../screens/MakerScreens/menu';
import CategoryDetailsScreen from '../../screens/MakerScreens/menu/category-details';

const Stack = createStackNavigator();

export default function MenuNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="MenuScreen">
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen
        name="CategoryDetailsScreen"
        component={CategoryDetailsScreen}
      />
    </Stack.Navigator>
  );
}

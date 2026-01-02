import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import InsightsScreen from '../../screens/MakerScreens/insights';

const Stack = createStackNavigator();

export default function InsightsNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="InsightsScreen">
      <Stack.Screen name="InsightsScreen" component={InsightsScreen} />
    </Stack.Navigator>
  );
}

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import InsightsScreen from '../../screens/MakerScreens/insights';
import LearnScreen from '../../screens/MakerScreens/learn';
import PlayerScreen from '../../screens/MakerScreens/learn/learnplayer-screen';

const Stack = createStackNavigator();

export default function LearnNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="InsightsScreen">
      <Stack.Screen name="LearnScreen" component={LearnScreen} />
      <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../../screens/UserScreens/profile/profile-screen/';
import SettingsScreen from '../../screens/UserScreens/profile/settings-screen/';
import EditScreen from '../../screens/UserScreens/profile/edit-screen';
import {AppTabNavigator} from './user-tabnavigator';

const Stack = createStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ProfileScreen">
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="EditScreen" component={EditScreen} />
    </Stack.Navigator>
  );
}

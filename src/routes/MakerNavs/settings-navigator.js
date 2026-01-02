import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Layout} from '@ui-kitten/components';

import SettingsScreen from '../../screens/MakerScreens/settings/settings-screen';
import ProfileScreen from '../../screens/MakerScreens/settings/profile-screen';
import EditScreen from '../../screens/MakerScreens/settings/edit-screen';
import LanguageScreen from '../../screens/MakerScreens/settings/language-screen';
import TimeSetScreen from '../../screens/MakerScreens/settings/timeset-screen';
import HistoryScreen from '../../screens/MakerScreens/settings/history-screen';
import FeedbacksScreen from '../../screens/MakerScreens/settings/feedback-screen';
import SupportScreen from '../../screens/MakerScreens/settings/support-screen';
import LoginScreen from '../../screens/login';

const Stack = createStackNavigator();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator initialRouteName="SettingsScreen">
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="EditScreen" component={EditScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen name="TimeSetScreen" component={TimeSetScreen} />
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="FeedbacksScreen" component={FeedbacksScreen} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="LogoutScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

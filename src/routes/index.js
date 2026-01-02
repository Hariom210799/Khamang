import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AuthNavigator from './auth-navigator';
import AppNavigator from './app-navigator';

const MainScreenStack = createStackNavigator();

function Navigator() {
  return (
    <NavigationContainer initialRoute={AuthNavigator}>
      <MainScreenStack.Navigator
        headerMode={false}
        initialRouteName="Login"
        screenOptions={{gestureEnabled: false}}>
        <MainScreenStack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
        />
        <MainScreenStack.Screen name="AppNavigator" component={AppNavigator} />
      </MainScreenStack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;

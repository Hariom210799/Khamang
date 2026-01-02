import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {MakerTabNavigator} from './MakerNavs/maker-tabnavigator';
import {UserTabNavigator} from './UserNavs/user-tabnavigator';
import TempSwitch from './TempSwitch';
import LoginScreen from '../screens/login';
import SignupScreen from '../screens/signup';
import {useSelector, useDispatch} from 'react-redux';

const Stack = createStackNavigator();

function AppNavigator() {
  const logged_user = useSelector((state) => state.main_app.logged_user);
  const isLoggedIn = logged_user.token !== '';
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="LoginScreen">
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
          </>
        ) : logged_user.role == 'maker' ? (
          <>
            <Stack.Screen name="MakerTabNavigator" component={MakerTabNavigator} />
            <Stack.Screen name="TempSwitch" component={TempSwitch} />
          </>
        ) : (
          <>
            <Stack.Screen name="UserTabNavigator" component={UserTabNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

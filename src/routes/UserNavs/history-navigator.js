import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HistoryScreen from '../../screens/UserScreens/history/history-screen/';
// import OrderDetails from '../../screens/UserScreens/history/orderdetails/';

const Stack = createStackNavigator();

export default function HistoryNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="HistoryScreen">
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      {/* <Stack.Screen name="OrderDetails" component={OrderDetails} /> */}
    </Stack.Navigator>
  );
}

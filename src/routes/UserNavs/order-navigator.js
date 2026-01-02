import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OrderScreen from '../../screens/UserScreens/order';
import MakerDetailsScreen from '../../screens/UserScreens/order/maker-details-screen';
import CartScreen from '../../screens/UserScreens/order/cart-screen';
import Pay from '../../screens/UserScreens/order/place-order';

const Stack = createStackNavigator();

export default function OrderNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="OrderScreen">
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen name="MakerDetailsScreen" component={MakerDetailsScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Pay" component={Pay} />
      {/* <Stack.Screen name="SettingsScreen" component={SettingsScreen} /> */}
    </Stack.Navigator>
  );
}

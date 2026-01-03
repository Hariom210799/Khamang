import React from 'react';
import {StyleSheet} from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import {Text, Layout} from '@ui-kitten/components';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrderNavigator from './order-navigator';
import HistoryNavigator from './history-navigator';
import ProfileNavigator from './profile-navigator';

const OrderIcon = (props) => <Icon {...props} name="home" pack="material" />;
const HistoryIcon = (props) => <Icon {...props} name="clipboard" pack="eva" />;
const ProfileIcon = (props) => (
  <Icon {...props} name="person" pack="material" />
);

const Tab = createBottomTabNavigator();

const useBottomNavigationState = (initialState = 0) => {
  const [selectedIndex, setSelectedIndex] = React.useState(initialState);
  return {selectedIndex, onSelect: setSelectedIndex};
};

const BottomTabBar = ({navigation, state}) => (
  <Layout>
    <BottomNavigation
      appearance="noIndicator"
      style={styles.bottomNavigation}
      selectedIndex={state.index}
      onSelect={(index) => {
        if (navigation) {
          try {
            navigation.navigate(state.routeNames[index]);
          } catch (e) {
            console.error('Navigation error:', e);
          }
        }
      }}>
      <BottomNavigationTab title="ORDER" icon={OrderIcon} />
      <BottomNavigationTab title="HISTORY" icon={HistoryIcon} />
      <BottomNavigationTab title="PROFILE" icon={ProfileIcon} />
    </BottomNavigation>
  </Layout>
);

export const UserTabNavigator = () => {
  const topState = useBottomNavigationState();
  const bottomState = useBottomNavigationState();

  return (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />} screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="OrderNavigator"
        component={OrderNavigator}
      />
      <Tab.Screen
        name="HistoryNavigator"
        component={HistoryNavigator}
        options={{title: ''}}
      />

      <Tab.Screen name="ProfileNavigator" component={ProfileNavigator} options={{title: ''}} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    // position: 'absolute',
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 50,
    elevation: 5,
  },
});

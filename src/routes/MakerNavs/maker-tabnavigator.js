import React from 'react';
import {StyleSheet} from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import {Layout} from '@ui-kitten/components';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import InboxNavigator from './inbox-navigator';
import InsightsNavigator from './insights-navigator';
import MenuNavigator from './menu-navigator';
import SettingsNavigator from './settings-navigator';
import LearnNavigator from './learn-navigator';

const MenuIcon = (props) => <Icon {...props} name="menu" pack="material" />;
const InboxIcon = (props) => <Icon {...props} name="inbox" pack="eva" />;
const LearnIcon = (props) => <Icon {...props} name="video" pack="eva" />;
const InsightIcon = (props) => <Icon {...props} name="bar-chart" pack="eva" />;
const SettingsIcon = (props) => (
  <Icon {...props} name="settings" pack="material" />
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
      onSelect={(index) => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title="HOME" icon={InboxIcon} />
      <BottomNavigationTab title="MENU" icon={MenuIcon} />
      <BottomNavigationTab title="INSIGHTS" icon={InsightIcon} />
      <BottomNavigationTab title="LEARN" icon={LearnIcon} />
      <BottomNavigationTab title="SETTINGS" icon={SettingsIcon} />
    </BottomNavigation>
  </Layout>
);

export const MakerTabNavigator = () => {
  const topState = useBottomNavigationState();
  const bottomState = useBottomNavigationState();

  return (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      <Tab.Screen
        name="InboxNavigator"
        options={{title: 'Order Khamang'}}
        component={InboxNavigator}
      />
      <Tab.Screen
        name="MenuNavigator"
        options={{title: 'Orders Received'}}
        component={MenuNavigator}
      />
      <Tab.Screen
        name="InsightsNavigator"
        options={{title: 'Orders Received'}}
        component={InsightsNavigator}
      />
      <Tab.Screen
        name="LearnNavigator"
        options={{title: 'Learn, Cook and Earn'}}
        component={LearnNavigator}
      />
      <Tab.Screen name="SettingsNavigator" component={SettingsNavigator} />
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

import React from 'react';
import {StyleSheet, ScrollView, StatusBar, Platform} from 'react-native';
import {
  TopNavigation,
  Layout,
  Toggle,
  Text,
  Icon,
  Divider,
} from '@ui-kitten/components';
import {useSelector, useDispatch} from 'react-redux';
import {logUserOut} from '../../../../redux-store/actions';
import {TouchableOpacity, View} from 'react-native';

// ✅ Dynamic status bar padding - adapts to actual device
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};

export default ({navigation}) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const logged_user = useSelector((state) => state.main_app.logged_user);

  const dispatch = useDispatch();
  const LogUserOut = () => {
    dispatch(logUserOut());
  };

  const settingsIndex = [
    {
      name: 'My Profile',
      description: 'View and manage profile',
      iconname: 'person',
      screen: 'ProfileScreen',
    },
    {
      name: 'Select Language',
      description: 'Change app language',
      iconname: 'translate',
      screen: 'LanguageScreen',
    },
    {
      name: 'Schedule Order Time',
      description: 'Set delivery times',
      iconname: 'schedule',
      screen: 'TimeSetScreen',
    },
    {
      name: 'Order History',
      description: 'View past orders',
      iconname: 'history',
      screen: 'HistoryScreen',
    },
    {
      name: 'Dark Mode',
      description: 'Toggle dark theme',
      iconname: 'brightness-4',
      toggle: true,
      value: darkMode,
    },
    {
      name: 'Feedbacks',
      description: 'Send us feedback',
      iconname: 'feedback',
      screen: 'FeedbacksScreen',
    },
    {
      name: 'Support',
      description: 'Get help and support',
      iconname: 'help',
      screen: 'SupportScreen',
    },
    {
      name: 'Logout',
      description: 'Sign out of account',
      iconname: 'logout',
      action: 'logout',
    },
  ];

  const handleSettingPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action === 'logout') {
      LogUserOut();
    }
  };

  const SettingItem = ({item}) => {
    if (item.toggle) {
      return (
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setDarkMode(!darkMode)}
          activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <Icon
              name={item.iconname}
              pack="material"
              style={styles.settingIcon}
            />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingName}>{item.name}</Text>
              <Text style={styles.settingDesc}>{item.description}</Text>
            </View>
          </View>
          <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => handleSettingPress(item)}
        activeOpacity={0.7}>
        <View style={styles.settingLeft}>
          <Icon
            name={item.iconname}
            pack="material"
            style={styles.settingIcon}
          />
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingName}>{item.name}</Text>
            <Text style={styles.settingDesc}>{item.description}</Text>
          </View>
        </View>
        <Icon
          name="arrow-ios-forward"
          pack="eva"
          style={styles.forwardIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation
        style={{paddingLeft: 20, paddingTop: getTopPadding()}}
        title={(TextProps) => (
          <Text {...TextProps} category="h2" status="primary">
            Settings
          </Text>
        )}
        alignment="start"
      />
      <Divider />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {settingsIndex.map((item, index) => (
            <View key={index}>
              <SettingItem item={item} />
              {index < settingsIndex.length - 1 && <Divider style={styles.itemDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 28,
    height: 28,
    fontSize: 28,
    color: '#FFD700',
  },
  settingTextContainer: {
    flex: 1,
    gap: 2,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDesc: {
    fontSize: 12,
    color: '#999',
  },
  forwardIcon: {
    width: 20,
    height: 20,
    fontSize: 20,
    color: '#ddd',
  },
  itemDivider: {
    backgroundColor: '#f0f0f0',
    height: 1,
  },
});

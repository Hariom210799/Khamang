import React from 'react';
import {StyleSheet} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Layout,
  Toggle,
  Text,
  Icon,
} from '@ui-kitten/components';
import {CommonActions} from '@react-navigation/native';
import {Setting} from './extra/settings-section.component';

export default ({navigation}) => {
  const [darkEnabled, setDarkEnabled] = React.useState(false);
  const navigateBack = () => {
    navigation.goBack();
  };

  const toggleDark = () => {
    setDarkEnabled(!darkEnabled);
  };

  const BackIcon = (evaProps) => (
    <Icon {...evaProps} name="arrow-back-outline" pack="eva" />
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  // const SettingsAction = () => <TopNavigationAction icon={SettingsIcon} />;
  return (
    <>
      <TopNavigation
        title={(TextProps) => {
          return (
            <Text {...TextProps} category="h2" status="primary" style={{}}>
              Settings
            </Text>
          );
        }}
        accessoryLeft={BackAction}
        alignment="start"
      />
      <Layout style={styles.container}>
        <Setting style={styles.setting} hint="Language" />
        <Setting style={styles.setting} hint="My Address Book" />
        <Setting style={styles.setting} hint="Dark Mode" onPress={toggleDark}>
          <Toggle checked={darkEnabled} onChange={toggleDark} />
        </Setting>
        <Setting style={styles.setting} hint="Notification" />
        <Setting style={styles.setting} hint="Privacy" />
        <Setting style={styles.setting} hint="Logout" />
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setting: {
    padding: 16,
  },
  section: {
    paddingTop: 32,
  },
});

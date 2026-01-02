import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, ScrollView} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Input,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const {width: screenWidth} = Dimensions.get('window');

class SupportScreen extends Component {
  render() {
    return (
      <Layout style={styles.container}>
        <TopNavigation
          // style={{paddingLeft: 20}}
          title={(TextProps) => {
            return (
              <Text category="h2" status="primary">
                Support
              </Text>
            );
          }}
          alignment="start"
        />
        <Divider />
        <Text category="h4">Description</Text>
        <Input multiline={true} textStyle={{ minHeight: 64 }} size='large' placeholder="Describe your problem" />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default SupportScreen;

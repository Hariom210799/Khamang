import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, ScrollView} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const {width: screenWidth} = Dimensions.get('window');

class FeedbacksScreen extends Component {
  render() {
    return (
      <Layout style={styles.container}>
        <TopNavigation
          // style={{paddingLeft: 20}}
          title={(TextProps) => {
            return (
              <Text category="h2" status="primary">
                FeedbacksScreen
              </Text>
            );
          }}
          alignment="start"
        />
        <Divider />
        <Layout
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text category="h5">Look at your Feedbacks</Text>
        </Layout>
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

export default FeedbacksScreen;

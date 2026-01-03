import React, {Component, useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import axios from 'react-native-axios';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardImage,
} from 'react-native-material-cards';
import CardButton from '../../../components/atoms/CardButton';
import CardOne from '../../../components/atoms/CardOne';
// import Carousel from '../../../components/atoms/Carousel';
import SwiperCard from '../../../components/atoms/Swiper/index';
import TinyCard from '../../../components/atoms/TinyCard';
import ListCard from '../../../components/atoms/ListCard';

const CartIcon = (props) => {
  return (
    <Icon
      {...props}
      name="shopping-cart"
      style={{color: 'black', fontSize: 25}}
      pack="material"
    />
  );
};
function SearchIcon(props) {
  return (
    <Icon
      {...props}
      style={{color: 'black', fontSize: 25}}
      name="search"
      pack="material"
    />
  );
}

// ✅ Dynamic status bar padding - adapts to actual device
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const {width: screenWidth} = Dimensions.get('window');

var config = {
  method: 'get',
  url: 'http://10.0.2.2:3000/api/v1/makers',
  headers: {
    // 'Content-Type': 'application/json',
  },
};

function OrderScreen(props) {
  const [homemakers, setHomemakers] = useState({
    data: {
      users: null,
    },
  });
  const LoadMakers = async () => {
    await axios(config)
      .then(function (res) {
        // console.log(JSON.stringify(res.data));
        // let json = res.json();
        // console.log(res);
        // console.log('Res.Data: ', JSON.stringify(res.data.data.users));
        setHomemakers(res.data);
        // console.log('Fetched', homemakers);
      })
      .catch(function (error) {
        console.log(error);
        window.alert(error.message);
      });
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    LoadMakers();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    LoadMakers();
  }, []);

  const Navigator = (maker_data) => {
    if (props.navigation) {
      try {
        props.navigation.navigate('MakerDetailsScreen', {maker_data});
      } catch (e) {
        console.error('Navigation error:', e);
      }
    }
  };
  const handleCartPress = ({navigation}) => {
    if (props.navigation) {
      try {
        props.navigation.navigate('CartScreen');
      } catch (e) {
        console.error('Navigation error:', e);
      }
    }
  };
  const renderRightActions = () => (
    <React.Fragment>
      <TopNavigationAction icon={SearchIcon} />
      {/* <TopNavigationAction icon={CartIcon} onPress={handleCartPress} /> */}
    </React.Fragment>
  );

  return (
    <Layout style={styles.container}>
      <TopNavigation
        style={{paddingLeft: 20, paddingTop: getTopPadding()}}
        title={(TextProps) => {
          return (
            <Text category="h2" status="primary">
              Khamang
            </Text>
          );
        }}
        accessoryRight={renderRightActions}
        alignment="start"
      />
      <Divider />
      <ScrollView
        style={styles.Container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Layout style={{flex: 1}}>
          <CardOne />
        </Layout>
        <Layout style={{flex: 1}}>
          <TinyCard />
        </Layout>
        <Layout style={{flex: 1}}>
          <ListCard Navigator={Navigator} homemakers={homemakers.data.users} />
        </Layout>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

// Ensure the export is always a valid React component
export default OrderScreen;

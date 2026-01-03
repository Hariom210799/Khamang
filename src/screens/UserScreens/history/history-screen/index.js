// import React from 'react';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {Tab, TabBar} from '@ui-kitten/components';

// const ProductsTabBar = ({navigation, state}) => {
//   const onTabSelect = (index) => {
//     navigation.navigate(state.routeNames[index]);
//   };

//   const renderTab = (route) => <Tab key={route} title={route.toUpperCase()} />;

//   return (
//     <TabBar selectedIndex={state.index} onSelect={onTabSelect}>
//       {state.routeNames.map(renderTab)}
//     </TabBar>
//   );
// };

// const TopTabs = createMaterialTopTabNavigator();

// export default () => (
//   // <TopTabs.Navigator tabBar={(props) => <ProductsTabBar {...props}/>}>
//   //   {/* <TopTabs.Screen name='All' component={ProductListScreen}/> */}
//   //   <TopTabs.Screen name='Previous Order' component={ProductListScreen}/>
//   //   {/* <TopTabs.Screen name='Lighting' component={ProductListScreen}/> */}
//   // </TopTabs.Navigator>
//   <ProductListScreen />
// );
import React, {Component} from 'react';
import {Dimensions, View, StyleSheet, StatusBar, Platform} from 'react-native';
import ProductListScreen from './product-list.component';
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
import CardButton from '../../../../components/atoms/CardButton';

// ✅ Dynamic status bar padding - adapts to actual device
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};

function SearchIcon(props) {
  return <Icon {...props} name="search-outline" pack="eva" />;
}
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const {width: screenWidth} = Dimensions.get('window');

class OrderScreen extends Component {
  render() {
    return (
      <>
        <TopNavigation
          style={{paddingLeft: 20, paddingTop: getTopPadding()}}
          title={(TextProps) => {
            return (
              <Text category="h2" status="primary">
                Order History
              </Text>
            );
          }}
          alignment="start"
        />
        <Layout style={{flex: 1}}>
          <Divider />
          <ProductListScreen />
        </Layout>
      </>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    height: ITEM_HEIGHT,
    width: SLIDER_WIDTH,
    flex: 1,
    margin: 20,
    borderRadius: 10,
    backgroundColor: 'green',
  },
  text: {
    color: 'white',
  },
  item: {
    width: SLIDER_WIDTH,
    height: ITEM_HEIGHT,
    alignSelf: 'center',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default OrderScreen;

import React from 'react';
import {Text, View, Dimensions, ImageBackground} from 'react-native';
import {Layout} from '@ui-kitten/components';
import Swiper from 'react-native-swiper';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const Header = (props) => <View {...props}></View>;

const items = [
  {
    title: 'Vada Paav',
    thumbnail: require('../../../assets/images/vadapav.jpg'),
  },
  {
    title: 'Bhendi Masala',
    thumbnail: require('../../../assets/images/bhendi.jpg'),
  },
  {
    title: 'Chole Bhature',
    thumbnail: require('../../../assets/images/chole-bhature.jpg'),
  },
  {
    title: 'Gajar Halwa',
    thumbnail: require('../../../assets/images/halwa.jpg'),
  },
  {
    title: 'Puran Poli',
    thumbnail: require('../../../assets/images/puranpoli.jpg'),
  },
];

var styles = {
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute',
    alignSelf: 'center',
  },
  view: {height: ITEM_HEIGHT},
  bgimg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    position: 'relative',
    opacity: 0.5,
    backgroundColor: 'black',
    // padding: 20,
    borderRadius: 10,
  },
};

export default () => (
  <View style={styles.view}>
    <Swiper
      style={styles.wrapper}
      bounces={false}
      //   showsButtons
      loop={true}
      autoplay>
      {items.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <ImageBackground style={styles.bgimg} source={item.thumbnail} />
            {/* <Text style={styles.text}>{item.title}</Text> */}
          </React.Fragment>
        );
      })}
    </Swiper>
  </View>
);

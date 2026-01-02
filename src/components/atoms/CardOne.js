import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Text as RNT} from 'react-native';
import {Button, Layout, Text} from '@ui-kitten/components';
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardImage,
} from 'react-native-material-cards';
import CardButton from './CardButton';
import SwiperCard from '../../components/atoms/Swiper/index';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const Header = (props) => <View {...props}></View>;

export default class CardOne extends Component {
  // _renderItem = ({item, index}) => {
  //   return <Carousel items={this.state.entries} />;
  // };
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      entries: [
        {
          title: 'Vada Paav',
          thumbnail: require('../../assets/images/vadapav.jpg'),
        },
        {
          title: 'Bhendi Masala',
          thumbnail: require('../../assets/images/bhendi.jpg'),
        },
        {
          title: 'Chole Bhature',
          thumbnail: require('../../assets/images/chole-bhature.jpg'),
        },
        {
          title: 'Gajar Halwa',
          thumbnail: require('../../assets/images/halwa.jpg'),
        },
        {
          title: 'Puran Poli',
          thumbnail: require('../../assets/images/puranpoli.jpg'),
        },
      ],
    };
  }

  render() {
    return (
      <View style={styles.topContainer}>
        <Card style={styles.card}>
          <SwiperCard />
          <CardTitle
            style={{position: 'absolute'}}
            titleStyle={styles.text}
            subtitleStyle={styles.text}
            title="Food is the way to be happy !"
            subtitle="Khamang takes you to your Home Taste"
          />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  card: {
    height: ITEM_HEIGHT,
    width: SLIDER_WIDTH,
    // flex: 1,
    margin: 20,
    borderRadius: 10,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 20,
  },
  text: {
    color: 'white',
  },
});

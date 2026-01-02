import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {Stat} from './Stat';
import {Slide} from './Slide';
import {styles} from './styles';

function Carousel(props) {
  const {style} = props;
  const items = [
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
  ];
  const itemsPerInterval =
    props.itemsPerInterval === undefined ? 1 : props.itemsPerInterval;

  const [interval, setInterval] = React.useState(1);
  const [intervals, setIntervals] = React.useState(1);
  const [width, setWidth] = React.useState(0);

  const init = (width) => {
    // initialise width
    setWidth(width);
    // initialise total intervals
    const totalItems = items.length;
    setIntervals(Math.ceil(totalItems / itemsPerInterval));
  };

  const getInterval = (offset) => {
    for (let i = 1; i <= intervals; i++) {
      if (offset + 1 < (width / intervals) * i) {
        return i;
      }
      if (i == intervals) {
        return i;
      }
    }
  };

  let bullets = [];
  for (let i = 1; i <= intervals; i++) {
    bullets.push(
      <Text
        key={i}
        style={{
          ...styles.bullet,
          opacity: interval === i ? 0.5 : 0.1,
        }}>
        &bull;
      </Text>,
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        scrollEnabled={true}
        contentContainerStyle={{
          ...styles.scrollView,
          width: `${100 * intervals}%`,
        }}
        scrollToEnd
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        onContentSizeChange={(w, h) => init(w)}
        onScroll={(data) => {
          setWidth(data.nativeEvent.contentSize.width);
          setInterval(getInterval(data.nativeEvent.contentOffset.x));
        }}
        scrollEventThrottle={200}
        pagingEnabled
        decelerationRate={0}>
        {items.map((item, index) => {
          switch (style) {
            case 'stats':
              return <Stat key={index} label={item.label} value={item.value} />;
            default:
              return (
                <Slide
                  key={index}
                  thumbnail={item.thumbnail}
                  title={item.title}
                />
              );
          }
        })}
      </ScrollView>
      <View style={styles.bullets}>{bullets}</View>
    </View>
  );
}

export default Carousel;

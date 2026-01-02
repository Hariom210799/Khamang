import React, {Component} from 'react';
import {StyleSheet, View, Dimensions, Text as RNT} from 'react-native';
import {Button, Layout, Text, Icon} from '@ui-kitten/components';
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardImage,
} from 'react-native-material-cards';
import CardButton from './CardButton';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const {width: screenWidth} = Dimensions.get('window');

const BurgerIcon = (props) => {
  return <Icon {...props} name="fastfood" pack="material" />;
};
const PizzaIcon = (props) => {
  return <Icon {...props} name="local-pizza" pack="material" />;
};
const CakeIcon = (props) => {
  return <Icon {...props} name="cake" pack="material" />;
};
const DrinksIcon = (props) => {
  return <Icon {...props} name="local-cafe" pack="material" />;
};

export default class TinyCard extends Component {
  render(props) {
    return (
      <View style={styles.topContainer}>
        <Card style={styles.card}>
          <Button
            style={styles.btnicon}
            size="giant"
            status="basic"
            accessoryLeft={BurgerIcon}
          />
        </Card>
        <Card style={styles.card}>
          <Button
            style={styles.btnicon}
            size="giant"
            status="basic"
            accessoryLeft={PizzaIcon}
          />
        </Card>
        <Card style={styles.card}>
          <Button
            style={styles.btnicon}
            size="giant"
            status="basic"
            accessoryLeft={CakeIcon}
          />
        </Card>
        <Card style={styles.card}>
          <Button
            style={styles.btnicon}
            size="giant"
            status="basic"
            accessoryLeft={DrinksIcon}
          />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnicon: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'grey',
  },
  card: {
    height: SLIDER_WIDTH / 6.5,
    width: SLIDER_WIDTH / 6,
    margin: 20,
    borderRadius: 10,
  },
});

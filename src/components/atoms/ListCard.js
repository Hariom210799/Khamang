import React, {Component, useEffect, useState} from 'react';
import axios from 'react-native-axios';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardImage,
} from 'react-native-material-cards';
import CardButton from './CardButton';
import {Layout, Avatar, Text, Button} from '@ui-kitten/components';
import home from '../../screens/MakerScreens/home';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const Header = (props) => <View {...props}></View>;

const ChefAvatar = ({size = 60}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#ffe0b2',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text style={{fontSize: size * 0.7}}>👨‍🍳</Text>
  </View>
);

export default function ListCard(props) {
  return (
    <View>
      {props.homemakers ? (
        props.homemakers.map((item, index) => {
          return (
            <Card key={index} style={styles.card}>
              {/* <Layout style={{width: '100%'}}> */}
              <TouchableOpacity
                style={{
                  width: '100%',
                }}
                onPress={() => props.Navigator(item)}>
                <View style={styles.friendItem}>
                  {item.propic ? (
                    <Avatar
                      style={{aspectRatio: 1.0, height: 100, width: 60}}
                      source={item.propic}
                    />
                  ) : (
                    <ChefAvatar size={60} />
                  )}
                  <View style={{flex: 1, paddingBottom: 10}}>
                    <CardTitle
                      title={item.firstName + ' ' + item.lastName}
                      subtitle={item.address}
                    />
                    {/* <Text category="h3" style={{margin: 10}}>
                    {item.name}
                  </Text>
                  <Text category="s2" style={{marginTop: -10, margin: 10}}>
                    {item.location}
                  </Text> */}
                  </View>
                </View>
                <CardContent text={item.aboutme} />
                {/* <Text>{item.description}</Text>
              </CardContent> */}
              </TouchableOpacity>

              <CardAction
                separator={true}
                inColumn={false}
                style={{
                  flex: 1,
                  alignContent: 'stretch',
                  marginHorizontal: -10,
                  alignItems: 'center',
                }}>
                <CardButton
                  onPress={() => props.Navigator(item)}
                  title="Go to Kitchen"
                  // color="blue"
                  style={{
                    padding: 5,
                    width: '100%',
                    height: '100%',
                    marginLeft: -4,
                  }}
                />
              </CardAction>
              {/* </Layout> */}
            </Card>
          );
        })
      ) : (
        // <View>
        <Text
          category="s1"
          style={{alignSelf: 'center', margin: 10, fontSize: 20}}>
          No Makers Available
        </Text>
        // </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    // backgroundColor: 'blue',
    width: '100%',
  },
  friendName: {
    marginTop: 8,
    color: 'grey',
    // backgroundColor: 'green',
  },
  card: {
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

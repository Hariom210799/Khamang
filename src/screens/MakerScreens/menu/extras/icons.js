import {Icon} from '@ui-kitten/components';
import {View} from 'react-native';
import React from 'react';

export const ForwardIcon = (props) => (
  <Icon {...props} name="arrow-ios-forward" pack="eva" />
);

export const DiningIcon = (props) => (
  <Icon
    {...props}
    style={{fontSize: 25, color: 'grey'}}
    name="local-dining"
    pack="material"
  />
);

export const PlusIcon = (props) => {
  return (
    // <View>
    <Icon
      {...props}
      style={[
        props.style,
        {
          marginHorizontal: 0,
        },
      ]}
      name="plus-circle"
      pack="eva"
    />
    // </View>
  );
};

export const CloseIcon = (props) => {
  return (
    <Icon
      style={{
        height: 25,
        width: 25,
        tintColor: '#808080',
        margin: 10,
        marginRight: 20,
      }}
      name="close"
      pack="eva"
      onPress={() => props.setModal(false)}
    />
  );
};

export const AddIcon = (props) => {
  return (
    <Icon
      style={{
        height: 30,
        width: 30,
        tintColor: '#FEA12E',
        margin: 10,
        // backgroundColor: 'red',
      }}
      name="plus"
      pack="eva"
    />
  );
};

export const MoreVerticalIcon = (props) => {
  return (
    <Icon
      style={{
        height: 30,
        width: 30,
        tintColor: '#808080',
        // margin: 10,
        // backgroundColor: 'red',
      }}
      name="more-vertical"
      pack="eva"
    />
  );
};

export const BackIcon = (props) => {
  return (
    <Icon
      style={{
        height: 30,
        width: 30,
        tintColor: '#808080',
        // backgroundColor: 'blue',
      }}
      onPress={() => props.navigation.goBack()}
      name="arrow-ios-back"
      pack="eva"
    />
  );
};

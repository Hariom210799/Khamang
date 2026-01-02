import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  TopNavigation,
  TopNavigationAction,
  Text as KText,
  Icon,
} from '@ui-kitten/components';

const PlayerScreen = ({route, navigation}) => {
  const {videoId, description} = route.params;
  const title = route.params.title.toString();
  const renderLeftActions = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
  function BackIcon(props) {
    return (
      <Icon
        {...props}
        name="arrow-back"
        pack="material"
        style={{color: 'grey', fontSize: 25}}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
      }}>
      <TopNavigation
        title={(TextProps) => {
          return (
            <KText category="s1" style={{color: 'black', fontSize: 20}}>
              YouTube Player
            </KText>
          );
        }}
        accessoryLeft={renderLeftActions}
        alignment="start"
      />
      <View
        style={{
          width: '100%',
          height: 200,
        }}>
        <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{uri: `https://www.youtube.com/embed/${videoId}`}}
        />
      </View>
      <Text
        style={{
          fontSize: 20,
          width: Dimensions.get('screen').width - 50,
          margin: 9,
        }}
        // numberOfLines={3}
        ellipsizeMode="tail">
        {title}
      </Text>
      <View style={{borderBottomWidth: 1}} />
      <Text
        style={{
          fontSize: 15,
          width: Dimensions.get('screen').width - 50,
          margin: 9,
        }}
        // numberOfLines={2}
        ellipsizeMode="tail">
        {description}
      </Text>
    </View>
  );
};

export default PlayerScreen;

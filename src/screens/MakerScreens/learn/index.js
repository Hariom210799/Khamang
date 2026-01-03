import React, {Component} from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Input,
  Button,
} from '@ui-kitten/components';
import {WebView} from 'react-native-webview';
import VidCard from '../../../components/atoms/videoCard/vidCard';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const {width: screenWidth} = Dimensions.get('window');

//https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=bhendi%20masala&type=video&key=AIzaSyAKCTwZ4mUSfWGUSN0lMQStOydxIEzKgIE

// ✅ Dynamic status bar padding - adapts to actual device
const getTopPadding = () => {
  if (Platform.OS === 'android') {
    return (StatusBar.currentHeight || 25) + 10;
  }
  return 15; // iOS default
};

export default function Learn() {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [vidCardData, setVidCardData] = React.useState([]);
  const debounceTimer = React.useRef(null);

  const fetchData = (searchQuery) => {
    if (!searchQuery.trim()) {
      setVidCardData([]);
      return;
    }
    
    setLoading(true);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchQuery)}+recipe&type=video&key=AIzaSyAorkKuhj6t9nbbPjLmVhJwiZqGk33NFAA`;
    console.log('Fetching URL:', url);
    
    fetch(url)
      .then((response) => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('API Response:', data);
        setLoading(false);
        if (data.error) {
          console.log('API Error:', data.error);
          alert('YouTube API Error: ' + (data.error.message || JSON.stringify(data.error)));
        } else if (data.items) {
          console.log('Found', data.items.length, 'videos');
          setVidCardData(data.items);
        } else {
          console.log('No items in response');
          setVidCardData([]);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('Search error:', error);
        alert('Error fetching videos: ' + error.message);
      });
  };

  // Debounced search on text change
  const handleSearchChange = (text) => {
    setValue(text);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      if (text.trim()) {
        fetchData(text);
      }
    }, 500);
  };

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    // <TouchableWithoutFeedback onPress={toggleSecureEntry}>
    //    <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    <Icon {...props} name="search" pack="material" />
    //  </TouchableWithoutFeedback>
  );

  const SendIcon = (props) => <Icon {...props} name="send" pack="material" />;

  return (
    <Layout style={styles.container}>
      <TopNavigation
        style={{paddingLeft: 20, paddingTop: getTopPadding()}}
        title={(TextProps) => {
          return (
            <Text category="h2" status="primary">
              Learn &nbsp; New
            </Text>
          );
        }}
        alignment="start"
      />
      <Divider />
      <Layout
        style={{
          flexDirection: 'row',
          // backgroundColor: 'red',
          justifyContent: 'space-around',
          padding: 10,
        }}>
        <Input
          textStyle={{color: 'black'}}
          style={styles.searhBox}
          value={value}
          placeholder="Search a Recipe"
          accessoryRight={renderIcon}
          onChangeText={handleSearchChange}
        />
        <Button
          onPress={() => fetchData(value)}
          style={styles.button}
          accessoryLeft={SendIcon}
          status="basic"
        />
        {/* <View
        style={{
          width: '100%',
          height: '80%',
        }}>
        <WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{uri: ` https://www.youtube.com/`}}
        />
      </View> */}
      </Layout>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" />
        ) : vidCardData.length === 0 ? (
          <Text category="h5">Search for a recipe to get started!</Text>
        ) : null}

        <FlatList
          style={{width: '100%'}}
          data={vidCardData}
          renderItem={({item}) => {
            return (
              <VidCard
                videoId={item.id.videoId}
                title={item.snippet.title}
                channel={item.snippet.channelTitle}
                thumbnail={item.snippet.thumbnails.medium.url}
                description={item.snippet.description}
              />
            );
          }}
          keyExtractor={(item) => item.id.videoId}
        />
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  searhBox: {
    width: '80%',
  },
  button: {height: '50%'},
});

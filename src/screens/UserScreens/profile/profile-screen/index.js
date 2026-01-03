import React, {useState} from 'react';
import {
  ImageBackground,
  ListRenderItemInfo,
  View,
  YellowBox,
  SafeAreaView,
} from 'react-native';
import {
  Avatar,
  Button,
  List,
  StyleService,
  Text,
  useStyleSheet,
  TopNavigation,
} from '@ui-kitten/components';
import {ImageOverlay} from './extras/image-overlay.component';
import {ProfileSocial} from './extras/profile-social.component';
import {SettingsIcon, LogoutIcon, EditIcon, PinIcon} from './extras/icons';
import {Post, Profile} from './extras/data';
import {useSelector, useDispatch} from 'react-redux';
import {logUserOut} from '../../../../redux-store/actions';
import DefaultAvatar from '../../../../components/DefaultAvatar';

/*
 * Will warn because container view is ScrollView that contains 3 List components inside.
 * Better workaround depends on the user needs.
 */
// YellowBox.ignoreWarnings([
//   'VirtualizedLists should never be nested inside plain ScrollViews',
// ]);

const profile = Profile.helenKuper();

const friends = [
  Profile.jenniferGreen(),
  Profile.jenniferGre(),
  Profile.jenniferGr(),
];

const posts = [
  Post.plant1(),
  Post.travel1(),
  Post.style1(),
  Post.plant(),
  Post.plan(),
  Post.pla(),
  Post.pl(),
  Post.plant111(),
  Post.plant14(),
];

// Helper to check if image exists (React Native limitation workaround)
function SafeAvatar({source, style}) {
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    console.log('SafeAvatar source:', source);
    if (error) console.log('SafeAvatar fallback triggered');
  }, [source, error]);
  if (!source || error) {
    return (
      <View
        style={[
          style,
          {
            borderWidth: 3,
            borderColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <DefaultAvatar size={style?.width || 80} />
      </View>
    );
  }
  return (
    <View
      style={[
        style,
        {
          borderWidth: 3,
          borderColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}>
      <Avatar
        style={{width: '100%', height: '100%'}}
        source={source}
        onError={() => setError(true)}
      />
    </View>
  );
}

export default ProfileScreen = ({navigation}) => {
  const styles = useStyleSheet(themedStyle);
  const dispatch = useDispatch();
  const loggedUser = useSelector(state => state.main_app.logged_user);
  const LogUserOut = () => dispatch(logUserOut());

  const onEditPress = () => {
    if (navigation) {
      try {
        navigation.navigate('EditScreen');
      } catch (e) {
        console.error('Navigation error:', e);
      }
    }
  };

  const onSettingsPress = () => {
    if (navigation) {
      try {
        navigation.navigate('SettingsScreen');
      } catch (e) {
        console.error('Navigation error:', e);
      }
    }
  };

  const onLogoutPress = () => {
    LogUserOut();
  };

  const renderFriendItem = (info) => (
    <View style={styles.friendItem}>
      <Avatar source={info.item.photo} />
      <Text style={styles.friendName} category="c2">
        {info.item.firstName}
      </Text>
    </View>
  );

  const renderPostItem = (info) => (
    <ImageBackground
      style={{ flex: 1, minWidth: 100, height: 100, margin: 4, borderRadius: 10, overflow: 'hidden' }}
      source={info.item.photo}
      resizeMode="cover"
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <List
        ListHeaderComponent={
          <ImageOverlay
            style={styles.header}
            source={require('../../../../assets/images/image-background.jpg')}>
            <SafeAvatar style={styles.profileAvatar} source={profile.photo} />
            <Text style={styles.profileName} category="h5" status="control">
              {loggedUser?.firstName} {loggedUser?.lastName}
            </Text>
            <View style={styles.locationContainer}>
              <PinIcon />
              <Text style={styles.location} status="control">
                {loggedUser?.address || profile.location}
              </Text>
            </View>
            <View style={styles.profileButtonsContainer}>
              <Button
                style={styles.profileButton}
                status="info"
                accessoryLeft={EditIcon}
                onPress={onEditPress}>
                EDIT PROFILE
              </Button>
              <Button
                style={styles.profileButton}
                status="control"
                accessoryLeft={LogoutIcon}
                onPress={onLogoutPress}>
                LOG OUT
              </Button>
            </View>
          </ImageOverlay>
        }
        data={posts}
        numColumns={3}
        renderItem={renderPostItem}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'stretch', paddingBottom: 40 }}
        columnWrapperStyle={{ flex: 1, justifyContent: 'space-between' }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'background-basic-color-2',
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    marginVertical: 16,
  },
  profileName: {
    zIndex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginVertical: 8,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 32,
    marginHorizontal: 20,
  },
  profileButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  socialsContainer: {
    flexDirection: 'row',
    width: '75%',
    marginVertical: 8,
  },
  profileSocial: {
    flex: 1,
  },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 10,
    marginHorizontal: 16,
    color: 'grey',
  },
  profileDescription: {
    marginHorizontal: 16,
  },
  friendsList: {
    marginHorizontal: 8,
  },
  friendItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  friendName: {
    marginTop: 8,
    color: 'grey',
  },
  postItem: {
    flex: 1,
    aspectRatio: 1.0,
  },
});

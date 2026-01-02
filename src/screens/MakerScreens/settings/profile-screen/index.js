import React from 'react';
import {
  ImageBackground,
  ScrollView,
  View,
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
import {useSelector, shallowEqual} from 'react-redux';
import {ImageOverlay} from './extras/image-overlay.component';
import {EditIcon, PinIcon} from './extras/icons';

export default ProfileScreen = ({navigation}) => {
  const styles = useStyleSheet(themedStyle);
  
  // Get user data from Redux with stable comparison
  const user = useSelector(
    state => state.main_app?.logged_user,
    shallowEqual
  );

  const onEditPress = () => {
    navigation && navigation.navigate('EditScreen');
  };

  const favorites = [
    {id: 1, name: 'Italian', icon: '🍝'},
    {id: 2, name: 'Chinese', icon: '🥡'},
    {id: 3, name: 'North Indian', icon: '🍛'},
  ];

  const renderFavItem = (info) => (
    <View style={styles.friendItem}>
      <View style={styles.favIconContainer}>
        <Text style={styles.favIcon}>{info.item.icon}</Text>
      </View>
      <Text style={styles.friendName} category="c2">
        {info.item.name}
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <TopNavigation
        title={() => (
          <Text category="h2" status="primary">
            Profile
          </Text>
        )}
        alignment="start"
      />
      <ScrollView style={styles.container}>
        <ImageOverlay
          style={styles.header}
          source={require('../../../../assets/images/image-background.jpg')}>
          <Avatar 
            style={styles.profileAvatar} 
            source={user?.photo ? {uri: user.photo} : null}
          />
          <Text style={styles.profileName} category="h5" status="control">
            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || 'User Name'}
          </Text>
          <View style={styles.locationContainer}>
            <PinIcon />
            <Text style={styles.location} status="control">
              {user?.address || 'Location Not Set'}
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
          </View>
        </ImageOverlay>

        {/* User Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'email@example.com'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📞 Phone</Text>
            <Text style={styles.infoValue}>{user?.phoneNumber || '+91 XXXXXXXXXX'}</Text>
          </View>
        </View>

        {user?.aboutme && (
          <Text style={styles.profileDescription}>
            {user.aboutme}
          </Text>
        )}

        <Text style={styles.sectionLabel} category="s1">
          Favorite Cuisines
        </Text>
        <List
          contentContainerStyle={styles.friendsList}
          horizontal={true}
          data={favorites}
          renderItem={renderFavItem}
        />
      </ScrollView>
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
    fontSize: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  location: {
    marginLeft: 4,
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 24,
    marginHorizontal: 20,
  },
  profileButton: {
    flex: 1,
  },
  infoSection: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
    color: '#FFD700',
    fontWeight: '700',
  },
  profileDescription: {
    marginHorizontal: 16,
    marginVertical: 8,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  friendsList: {
    marginHorizontal: 8,
    paddingBottom: 20,
  },
  friendItem: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  favIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  favIcon: {
    fontSize: 36,
  },
  friendName: {
    marginTop: 4,
    color: '#333',
    fontWeight: '500',
  },
});

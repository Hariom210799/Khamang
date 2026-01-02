
import React from 'react';
import { ScrollView } from 'react-native';
import { Button, StyleService, useStyleSheet } from '@ui-kitten/components';
import { ProfileAvatar } from './extra/profile-avatar.component';
import { ProfileSetting } from './extra/profile-setting.component';
import { CameraIcon } from './extra/icons';
import { useSelector } from 'react-redux';

export default ({navigation}) => {
  const styles = useStyleSheet(themedStyle);

  // Get logged in user from Redux
  const loggedUser = useSelector(state => state.main_app.logged_user);

  const onDoneButtonPress = () => {
    navigation && navigation.goBack();
  };

  const renderPhotoButton = () => (
    <Button
      style={styles.editAvatarButton}
      status="basic"
      accessoryLeft={CameraIcon}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <ProfileAvatar
        style={styles.profileAvatar}
        // No user-uploaded photo yet, fallback to default avatar
        source={null}
        editButton={renderPhotoButton}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="First Name"
        value={loggedUser?.firstName || ''}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Last Name"
        value={loggedUser?.lastName || ''}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Gender"
        value={loggedUser?.gender || ''}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Age"
        value={loggedUser?.age ? String(loggedUser.age) : ''}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Weight"
        value={loggedUser?.weight ? `${loggedUser.weight} kg` : ''}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Height"
        value={loggedUser?.height ? `${loggedUser.height} cm` : ''}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="Email"
        value={loggedUser?.email || ''}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Phone Number"
        value={loggedUser?.phoneNumber || ''}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="FavoriteCusines"
        value={loggedUser?.FavoriteCusines || ''}
      />
      <Button style={styles.doneButton} onPress={onDoneButtonPress}>
        DONE
      </Button>
    </ScrollView>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingVertical: 24,
  },
  profileAvatar: {
    aspectRatio: 1.0,
    height: 124,
    alignSelf: 'center',
  },
  editAvatarButton: {
    aspectRatio: 1.0,
    height: 48,
    borderRadius: 24,
  },
  profileSetting: {
    padding: 16,
  },
  section: {
    marginTop: 30,
  },
  doneButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
});

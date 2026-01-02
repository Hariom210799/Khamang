import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {Button, StyleService, useStyleSheet} from '@ui-kitten/components';
import {useSelector, shallowEqual} from 'react-redux';
import {ProfileAvatar} from './extra/profile-avatar.component';
import {ProfileSetting} from './extra/profile-setting.component';
import {CameraIcon} from './extra/icons';

export default ({navigation}) => {
  const styles = useStyleSheet(themedStyle);
  
  // Get user data from Redux with stable comparison
  const user = useSelector(
    state => state.main_app?.logged_user,
    shallowEqual
  );
  
  // Initialize state with Redux user data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    gender: user?.gender || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    FavoriteCusines: user?.FavoriteCusines || '',
    photo: user?.photo || null,
  });

  // Update form when Redux user changes
  useEffect(() => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      gender: user?.gender || '',
      age: user?.age || '',
      weight: user?.weight || '',
      height: user?.height || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      FavoriteCusines: user?.FavoriteCusines || '',
      photo: user?.photo || null,
    });
  }, [user]);

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
        source={formData.photo ? {uri: formData.photo} : null}
        editButton={renderPhotoButton}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="First Name"
        value={formData.firstName}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Last Name"
        value={formData.lastName}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Gender"
        value={formData.gender}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Age"
        value={`${formData.age}`}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Weight"
        value={`${formData.weight} kg`}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Height"
        value={`${formData.height} cm`}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="Email"
        value={formData.email}
      />
      <ProfileSetting
        style={styles.profileSetting}
        hint="Phone Number"
        value={formData.phoneNumber}
      />
      <ProfileSetting
        style={[styles.profileSetting, styles.section]}
        hint="FavoriteCusines"
        value={formData.FavoriteCusines}
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

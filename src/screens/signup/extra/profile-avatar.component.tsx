
import React from 'react';
import { StyleSheet, View, ViewProps, TouchableOpacity, Text } from 'react-native';
import { Avatar, AvatarProps, ButtonElement, ButtonProps, Icon } from '@ui-kitten/components';

export interface ProfileAvatarProps extends AvatarProps {
  editButton?: () => ButtonElement;
  onAvatarPress?: () => void;
  showHelperText?: boolean;
}


export const ProfileAvatar = (props: ProfileAvatarProps): React.ReactElement<ViewProps> => {
  const { style, editButton, onAvatarPress, showHelperText, source, ...restProps } = props;

  // Show default user icon if no image
  const showDefaultIcon = !source || (typeof source === 'object' && source.uri === undefined);

  return (
    <View style={[style, styles.avatarContainer]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onAvatarPress}
        style={styles.touchableAvatar}
        accessibilityLabel="Upload profile photo"
      >
        {showDefaultIcon ? (
          <View style={[styles.avatar, {backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center'}]}>
            <Icon name="person" pack="eva" style={styles.defaultIcon} />
          </View>
        ) : (
          <Avatar
            style={[styles.avatar]}
            {...restProps}
            source={source}
          />
        )}
      </TouchableOpacity>
      {editButton ? (
        <TouchableOpacity
          style={styles.editButton}
          onPress={onAvatarPress}
          accessibilityLabel="Add or change profile photo"
          activeOpacity={0.7}
        >
          <Icon name="plus-circle" pack="eva" style={styles.plusIcon} />
        </TouchableOpacity>
      ) : null}
      {showHelperText && (
        <Text style={styles.helperText}>
          Tap avatar or + to upload. JPG/PNG, max 2MB.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  touchableAvatar: {
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: '#f5f6fa',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultIcon: {
    width: 48,
    height: 48,
    tintColor: '#bdbdbd',
    alignSelf: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
    elevation: 2,
  },
  plusIcon: {
    width: 28,
    height: 28,
    tintColor: '#ff9800',
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});


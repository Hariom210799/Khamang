import React from 'react';
import {Icon, IconElement, useTheme} from '@ui-kitten/components';
import {ImageStyle} from 'react-native';

export const SettingsIcon = (evaProps) => (
  <Icon {...evaProps} name="settings" pack="eva" />
);

export const EditIcon = (style) => <Icon {...style} name="edit-2" pack="eva" />;

export const PinIcon = (): IconElement => {
  const theme = useTheme();
  return (
    <Icon
      style={{width: 16, height: 16}}
      fill={theme['text-control-color']}
      name="pin"
      pack="eva"
    />
  );
};

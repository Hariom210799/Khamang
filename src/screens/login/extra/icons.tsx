import React from 'react';
import {ImageStyle} from 'react-native';
import {Icon, IconElement} from '@ui-kitten/components';
// Use only Eva icons for social icons to ensure compatibility

export const EmailIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="email" pack="eva" />
);

export const LockIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="lock" />
);

export const PhoneIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="phone" />
);


export const FacebookIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="facebook" pack="eva" />
);

export const GoogleIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="google" pack="eva" />
);

export const PersonIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="person" pack="eva" />
);

export const TwitterIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name="twitter" pack="eva" />
);


import React from 'react';
import { ImageStyle } from 'react-native';
import { Icon, IconElement } from '@ui-kitten/components';

export const CloseIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='close' pack="eva" />
);

export const MinusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='minus-outline' pack="eva" />
);

export const PlusIcon = (style: ImageStyle): IconElement => (
  <Icon {...style} name='plus' pack="eva" />
);



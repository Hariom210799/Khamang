import {Dimensions} from 'react-native';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
export const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
export const {width: screenWidth} = Dimensions.get('window');

import React from 'react';
import {Button} from '@ui-kitten/components';
import {launchImageLibrary} from 'react-native-image-picker';

export default function ImagePickerButton({onImagePicked}) {
  const pickImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets && result.assets.length > 0) {
      onImagePicked(result.assets[0]);
    }
  };
  return (
    <Button onPress={pickImage} status="info" style={{marginVertical: 8}}>
      Upload Image from Gallery
    </Button>
  );
}

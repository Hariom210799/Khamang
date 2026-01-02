import React, {useState, useEffect, useMemo} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Text as RNText, ActivityIndicator, TouchableOpacity} from 'react-native';
import ImagePickerButton from './ImagePickerButton';
import {CloseIcon} from '../extras/icons';
import {ITEM_WIDTH, ITEM_HEIGHT} from '../../../../utils/dimensions';
import {Button, Card, Input, Modal, Text} from '@ui-kitten/components';
import axios from 'axios';
import {compressImage, formatFileSize} from '../../../../utils/imageUtils';

// ⚡ SIMPLE IMAGE COMPRESSION - without external library
// Just send the image as-is, server can handle it
// Or use a simpler approach with native React Native Image API

function DishModal(props) {
  const {
    dishId,
    menuId,
    makerId,
    categoryName,
    dishModal,
    setDishModal,
    setDishId,
    ReRender,
  } = props;

  console.log('DishModal props received:', {
    dishId,
    menuId,
    makerId,
    categoryName,
    dishModal,
  });

  const [dishTitle, setDishTitle] = useState('');
  const [dishCuisineType, setDishCuisineType] = useState('');

  // ✅ store price as text for Input
  const [priceText, setPriceText] = useState('');

  const [localImage, setLocalImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Helper: reset form safely
  const resetForm = () => {
    setDishTitle('');
    setDishCuisineType('');
    setPriceText('');
    setLocalImage(null);
    setDishId?.(null);
  };

  // ✅ Convert priceText -> number when sending to backend
  const getPriceNumber = () => {
    const cleaned = String(priceText || '').replace(/[^\d.]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  };

  // --- CONFIGS (created when needed so latest state is used) ---
  const getFetchConfig = () => ({
    method: 'get',
    url: `http://10.0.2.2:3000/api/v1/dishes/${dishId}`,
    headers: {},
  });

  const getUpdateConfig = () => ({
    method: 'patch',
    url: `http://10.0.2.2:3000/api/v1/dishes/${dishId}`,
    headers: {'Content-Type': 'application/json'},
    data: JSON.stringify({
      menu_id: menuId,
      category_name: categoryName,
      name: dishTitle,
      cuisine_type: dishCuisineType,
      price: getPriceNumber(),
    }),
  });

  const FetchDish = async () => {
    try {
      const response = await axios(getFetchConfig());
      const dish = response?.data?.data?.dish;

      setDishCuisineType(dish?.cuisine_type ?? '');
      setDishTitle(dish?.name ?? '');

      // ✅ display number as text in Input
      const p = dish?.price;
      setPriceText(p === 0 || p ? String(p) : '');
    } catch (error) {
      console.log(error?.message || error);
    }
  };

  const UpdateDish = async () => {
    try {
      console.log('UpdateDish: Starting');
      console.log('🔍 UpdateDish: localImage status:', {
        hasLocalImage: !!localImage,
        localImageValue: localImage,
        localImageUri: localImage?.uri,
        localImageType: localImage?.type,
      });
      setIsSubmitting(true);

      let imageUrl = null;

      // If image is selected, upload to Cloudinary directly
      if (localImage) {
        console.log('📸 UpdateDish: Image selected, uploading...');
        
        try {
          // Get signature from server
          console.log('📋 Requesting signature from server...');
          const sigResponse = await axios.post('http://10.0.2.2:3000/api/v1/cloudinary/signature');
          const { signature, timestamp, cloudName, apiKey } = sigResponse.data;
          console.log('✅ Signature received:', { signature, timestamp, cloudName, apiKey });
          
          // Upload to Cloudinary - NO COMPRESSION, direct upload
          const formData = new FormData();
          formData.append('file', {
            uri: localImage.uri,
            type: localImage.type,
            name: localImage.filename || 'image.jpg',
          });
          formData.append('signature', signature);
          formData.append('timestamp', timestamp);
          formData.append('api_key', apiKey);
          formData.append('folder', 'khamang_dishes');
          
          console.log('📤 Uploading to Cloudinary (no compression)...');
          console.log('🔗 URL:', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
          console.log('⏳ Uploading...');
          
          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.log('⏱️ Upload timeout - aborting request (45s timeout)');
            controller.abort();
          }, 45000);
          
          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
              signal: controller.signal,
            }
          );
          
          clearTimeout(timeoutId);
          console.log('📨 Cloudinary response status:', cloudinaryResponse.status);
          
          // Always try to parse response, even if status is not OK
          let cloudinaryData;
          try {
            cloudinaryData = await cloudinaryResponse.json();
            console.log('✅ Cloudinary response data:', cloudinaryData);
          } catch (e) {
            console.log('❌ Failed to parse Cloudinary response:', e.message);
            const errorText = await cloudinaryResponse.text();
            console.log('❌ Cloudinary error text:', errorText);
            throw new Error(`Cloudinary response parse error: ${errorText}`);
          }
          
          // Check if we got a secure_url, even if status was not OK
          if (!cloudinaryData.secure_url) {
            console.log('❌ No secure_url in Cloudinary response:', cloudinaryData);
            throw new Error(`No secure_url from Cloudinary: ${JSON.stringify(cloudinaryData)}`);
          }
          
          imageUrl = cloudinaryData.secure_url;
          console.log('✅ Image URL extracted:', imageUrl);
        } catch (imageError) {
          console.log('⚠️ Image upload failed, will update dish without image:', imageError?.message);
          console.log('Continuing with dish update without image...');
          imageUrl = null; // Set to null, allow dish update without image
        }
      }
      
      // Now send to server with image URL
      console.log('UpdateDish: Sending dish data with image URL...');
      const payload = {
        menu_id: menuId,
        category_name: categoryName,
        name: dishTitle.trim(),
        cuisine_type: dishCuisineType.trim(),
        price: getPriceNumber(),
      };
      
      // Add image only if it was updated
      if (imageUrl) {
        payload.image = imageUrl;
      }
      
      console.log('🎯 Final update payload being sent:', JSON.stringify(payload, null, 2));
      const response = await axios({
        method: 'patch',
        url: `http://10.0.2.2:3000/api/v1/dishes/${dishId}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ UpdateDish: Success response:', response?.data);
      
      // ✅ Close modal and reset state immediately (no delay)
      console.log('UpdateDish: Closing modal');
      setDishModal(false);
      resetForm();
      setIsSubmitting(false);
      
      // ✅ Reload dishes in background (don't wait)
      console.log('UpdateDish: Reloading dishes in background');
      if (ReRender) ReRender();
      
    } catch (error) {
      console.log('❌ UpdateDish: Error caught:', error?.message);
      console.log('UpdateDish: Full error:', error);
      setIsSubmitting(false);
      
      // Check if it's a timeout or other error
      if (error.name === 'AbortError') {
        alert('⏱️ Cloudinary upload took too long (30s timeout). Try a smaller image or check your internet connection.');
      } else if (error.code === 'ECONNABORTED') {
        alert('⏱️ Upload took too long. Try a smaller image or without image.');
      } else if (error.response?.status === 413) {
        alert('📦 File is too large. Maximum 10MB allowed.');
      } else {
        alert('❌ Error updating dish: ' + (error?.message || 'Unknown error'));
      }
    }
  };

  const CreateDish = async () => {
    try {
      console.log('CreateDish: Starting');
      console.log('🔍 CreateDish: localImage status:', {
        hasLocalImage: !!localImage,
        localImageValue: localImage,
        localImageUri: localImage?.uri,
        localImageType: localImage?.type,
      });
      setIsSubmitting(true);

      let imageUrl = null;

      // If image is selected, upload to Cloudinary directly
      if (localImage) {
        console.log('📸 CreateDish: Image selected, uploading...');
        
        try {
          // Get signature from server
          console.log('📋 Requesting signature from server...');
          const sigResponse = await axios.post('http://10.0.2.2:3000/api/v1/cloudinary/signature');
          const { signature, timestamp, cloudName, apiKey } = sigResponse.data;
          console.log('✅ Signature received:', { signature, timestamp, cloudName, apiKey });
          
          // Upload to Cloudinary - NO COMPRESSION, direct upload
          const formData = new FormData();
          formData.append('file', {
            uri: localImage.uri,
            type: localImage.type,
            name: localImage.filename || 'image.jpg',
          });
          formData.append('signature', signature);
          formData.append('timestamp', timestamp);
          formData.append('api_key', apiKey);
          formData.append('folder', 'khamang_dishes');
          
          console.log('📤 Uploading to Cloudinary (no compression)...');
          console.log('🔗 URL:', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
          console.log('⏳ Uploading...');
          
          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.log('⏱️ Upload timeout - aborting request (45s timeout)');
            controller.abort();
          }, 45000); // 45 second timeout
          
          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
              signal: controller.signal,
            }
          );
          
          clearTimeout(timeoutId);
          console.log('📨 Cloudinary response status:', cloudinaryResponse.status);
          
          // Always try to parse response, even if status is not OK
          let cloudinaryData;
          try {
            cloudinaryData = await cloudinaryResponse.json();
            console.log('✅ Cloudinary response data:', cloudinaryData);
          } catch (e) {
            console.log('❌ Failed to parse Cloudinary response:', e.message);
            const errorText = await cloudinaryResponse.text();
            console.log('❌ Cloudinary error text:', errorText);
            throw new Error(`Cloudinary response parse error: ${errorText}`);
          }
          
          // Check if we got a secure_url, even if status was not OK
          if (!cloudinaryData.secure_url) {
            console.log('❌ No secure_url in Cloudinary response:', cloudinaryData);
            throw new Error(`No secure_url from Cloudinary: ${JSON.stringify(cloudinaryData)}`);
          }
          
          imageUrl = cloudinaryData.secure_url;
          console.log('✅ Image URL extracted:', imageUrl);
        } catch (imageError) {
          console.log('⚠️ Image upload failed, will create dish without image:', imageError?.message);
          console.log('Continuing with dish creation without image...');
          imageUrl = null; // Set to null, allow dish creation without image
        }
      }
      
      // Now send to server with image URL
      console.log('CreateDish: Sending dish data with image URL...');
      const payload = {
        name: dishTitle.trim(),
        cuisine_type: dishCuisineType.trim(),
        price: getPriceNumber(),
        available: true,
        category_name: categoryName,
        maker_id: makerId,
        menu_id: menuId,
        image: imageUrl || null, // Send Cloudinary URL or null
      };
      
      console.log('🎯 Final payload being sent:', JSON.stringify(payload, null, 2));
      const response = await axios({
        method: 'post',
        url: 'http://10.0.2.2:3000/api/v1/dishes',
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ CreateDish: Success response:', response?.data);
      console.log('✅ CreateDish: Response status:', response?.status);
      
      // ✅ Close modal and reset state immediately (no delay)
      console.log('CreateDish: About to close modal...');
      setDishModal(false);
      console.log('CreateDish: Modal close called');
      resetForm();
      console.log('CreateDish: Form reset called');
      setIsSubmitting(false);
      console.log('CreateDish: isSubmitting set to false');
      
      // ✅ Reload dishes in background (don't wait)
      console.log('CreateDish: Reloading dishes in background');
      if (ReRender) ReRender();
      
    } catch (error) {
      console.log('❌ CreateDish: Error caught:', error?.message);
      console.log('CreateDish: Full error:', error);
      setIsSubmitting(false);
      
      // Check if it's a timeout or other error
      if (error.name === 'AbortError') {
        alert('⏱️ Cloudinary upload took too long (30s timeout). Try a smaller image or check your internet connection.');
      } else if (error.code === 'ECONNABORTED') {
        alert('⏱️ Upload took too long. Try a smaller image or without image.');
      } else if (error.response?.status === 413) {
        alert('📦 File is too large. Maximum 10MB allowed.');
      } else {
        alert('❌ Error creating dish: ' + (error?.message || 'Unknown error'));
      }
    }
  };

  const submitDish = async () => {
    console.log('submitDish called');
    console.log('🔥 submitDish: Current localImage state:', localImage);
    console.log('🔥 submitDish: isSubmitting state:', isSubmitting);
    
    const titleTrimmed = dishTitle.trim();
    if (!titleTrimmed) {
      alert('Please enter Dish Name');
      return;
    }

    // Warn if image is VERY large (>5MB)
    if (localImage && localImage.fileSize > 5 * 1024 * 1024) {
      alert('⚠️ Image is quite large (' + formatFileSize(localImage.fileSize) + '). It will be compressed before upload. OK to proceed?');
      return;
    }

    console.log('🔥 submitDish: About to set isSubmitting to true');
    setIsSubmitting(true);
    
    if (dishId) {
      await UpdateDish();
    } else {
      console.log('Calling CreateDish');
      await CreateDish();
    }
  };

  useEffect(() => {
    if (dishId && dishModal) {
      FetchDish();
    }
    // if opening for NEW dish - ONLY reset form when modal first opens
    if (!dishId && dishModal) {
      // ✅ Only reset if NOT currently submitting (to preserve image during submission)
      if (!isSubmitting) {
        setDishTitle('');
        setDishCuisineType('');
        setPriceText('');
        setLocalImage(null);
      }
    }
  }, [dishId, dishModal, isSubmitting]);

  return (
    <Modal
      key={`dish-modal-${dishModal}`}
      visible={!!dishModal}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => {
        console.log('Modal backdrop pressed');
        setDishModal(false);
        resetForm();
      }}
    >
      {console.log('🔵 Modal is rendering, visible =', !!dishModal)}
      <Card disabled={true} style={styles.card}>
        {/* Close Icon - Circular Container */}
        <View style={styles.closeContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setDishModal(false);
              resetForm();
            }}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          >
            <CloseIcon
              setModal={() => {
                setDishModal(false);
                resetForm();
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Keyboard + Scroll */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
            contentContainerStyle={styles.mainview}
          >
            {/* Header */}
            <Text style={styles.modalTitle}>
              {dishId ? 'Edit Dish' : 'Add New Dish'}
            </Text>

            {/* Image Section */}
            <View style={styles.imageSection}>
              {localImage ? (
                // Show uploaded image
                <Image
                  source={{uri: localImage.uri}}
                  style={styles.uploadedImage}
                />
              ) : (
                // Show blue button to add image
                <ImagePickerButton onImagePicked={(img) => setLocalImage(img)} />
              )}
            </View>

            {/* Dish Name */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Dish Name</Text>
              <Input
                textStyle={styles.inputText}
                status="basic"
                placeholder="e.g., Paneer Tikka"
                value={dishTitle}
                onChangeText={setDishTitle}
                style={styles.input}
              />
            </View>

            {/* Cuisine Type */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Cuisine Type</Text>
              <Input
                multiline
                textStyle={styles.inputText}
                status="basic"
                placeholder="e.g., Veg"
                value={dishCuisineType}
                onChangeText={setDishCuisineType}
                style={styles.input}
              />
            </View>

            {/* Price */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Price (in Rs.)</Text>
              <Input
                textStyle={styles.inputText}
                status="basic"
                placeholder="e.g., 120"
                keyboardType="numeric"
                value={priceText}
                onChangeText={(txt) => {
                  const cleaned = txt.replace(/[^\d]/g, '');
                  setPriceText(cleaned);
                }}
                style={styles.input}
              />
            </View>

            {/* Submit Button */}
            <Button 
              style={styles.submitButton}
              onPress={submitDish} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'PROCESSING...' : (dishId ? 'UPDATE' : 'ADD DISH')}
            </Button>

            {/* Loading Overlay */}
            {isSubmitting && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FFD700" />
                <RNText style={styles.loadingText}>
                  {localImage ? 'Uploading image...' : 'Updating menu...'}
                </RNText>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // ✅ Gold-themed card with border
  card: {
    width: '100%',
    height: '95%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFD700',
    overflow: 'hidden',
  },
  // ✅ Close button circular container
  closeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // ✅ Main content scrolling area
  mainview: {
    width: '100%',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
    justifyContent: 'flex-start',
  },
  // ✅ Modal title
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    alignSelf: 'center',
    marginBottom: 8,
  },
  // ✅ Image section
  imageSection: {
    width: '100%',
    gap: 12,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  // ✅ Form sections with labels
  formSection: {
    width: '100%',
    gap: 6,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  inputText: {
    color: '#111',
    fontSize: 15,
  },
  // ✅ Gold primary button
  submitButton: {
    marginTop: 12,
    marginBottom: 18,
    height: 48,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    borderWidth: 0,
  },
  submitButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  // ✅ Loading overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    gap: 12,
    zIndex: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});

export default DishModal;

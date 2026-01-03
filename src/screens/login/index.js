import React from 'react';
import {View, Dimensions, Alert} from 'react-native';
import axios from 'axios';
import {
  Button,
  Input,
  StyleService,
  Text,
  useStyleSheet,
  Radio,
  RadioGroup,
} from '@ui-kitten/components';
import {
  EmailIcon,
  FacebookIcon,
  GoogleIcon,
  TwitterIcon,
  LockIcon,
} from './extra/icons';
import {ImageOverlay} from './extra/image-overlay.component';
import {logUser} from '../../redux-store/actions';
import jwt_decode from 'jwt-decode';
import {useDispatch} from 'react-redux';
import API_CONFIG from '../../config/api';

export default ({navigation}) => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [emailcaption, setEmailCaption] = React.useState('');
  const validate = (text) => {
    let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\w{2,3})+$/;
    if (reg.test(text) === false) {
      setEmailCaption('Incorrect Email Id !');
    } else {
      setEmailCaption('');
    }
  };
  var data = JSON.stringify({email: email, password: password});
  // var data = JSON.stringify({email: 'adi@jonas.io', password: 'pass1234'});
  const windowHeight = Dimensions.get('window').height;

  // const logged_user = useSelector((state) => state.main_app.logged_user);
  const dispatch = useDispatch();
  const LogUser = (logindata) => dispatch(logUser(logindata));

  var config = {
    method: 'post',
    url: API_CONFIG.LOGIN,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  const styles = useStyleSheet(themedStyles);

  const onSignInButtonPress = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      const res = await axios(config);
      
      let decoded = jwt_decode(res.data.token);
      if (res.data.status === 'success') {
        try {
          // Fetch full user profile
          const userRes = await axios.get(
            API_CONFIG.GET_USER(decoded.id),
          );
          
          const user = userRes.data.user;
          LogUser({
            token: res.data.token,
            email: user.email,
            id: user._id,
            role: user.role || (selectedIndex ? 'maker' : 'user'),
            address: user.address || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            gender: user.gender || '',
            age: user.age || '',
            weight: user.weight || '',
            height: user.height || '',
            phoneNumber: user.phoneNumber || user.phone || '',
            FavoriteCusines: user.FavoriteCusines || '',
            aboutme: user.aboutme || '',
            kitchenName: user.kitchenName || '',
          });
        } catch (profileError) {
          // If fetching profile fails, still log in with basic token info
          LogUser({
            token: res.data.token,
            email: decoded.email || email,
            id: decoded.id,
            role: selectedIndex ? 'maker' : 'user',
            address: '',
            firstName: '',
            lastName: '',
            gender: '',
            age: '',
            weight: '',
            height: '',
            phoneNumber: '',
            FavoriteCusines: '',
            aboutme: '',
            kitchenName: '',
          });
        }
      }
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert('Login Error', errorMessage);
    }
  };

  const onSignUpButtonPress = () => {
    navigation && navigation.navigate('SignupScreen');
  };

  const onPasswordIconPress = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    // <KeyboardAvoidingView>
    <>
      <View style={styles.flexContainer}>
        {/* <ScrollView style={{flex: 1}}> */}
        <View style={[styles.fullWidth, {height: windowHeight}]}>
          <ImageOverlay
            style={styles.container}
            source={require('../../assets/images/start_stove.jpg')}>
            <View style={styles.headerContainer}>
              <Text style={styles.helloLabel} status="control">
                Sign In
              </Text>
              <Text style={styles.signInLabel} category="s1" status="control">
                Get Started with Signing In
              </Text>
            </View>

            <View style={styles.tabContentContainer}>
              <View style={styles.roleContainer}>
                <Text
                  category="h6"
                  status="control"
                  style={styles.roleLabel}>
                  Role :
                </Text>
                <RadioGroup
                  style={styles.radioContainer}
                  status="control"
                  selectedIndex={selectedIndex}
                  onChange={(index) => {
                    setSelectedIndex(index);
                  }}>
                  <Radio>User</Radio>
                  <Radio>Maker</Radio>
                </RadioGroup>
              </View>
              <Input
                style={styles.formInput}
                status="control"
                placeholder="Email"
                accessoryLeft={EmailIcon}
                value={email}
                onChangeText={setEmail}
                caption={
                  <Text style={styles.errorCaption}>{emailcaption}</Text>
                }
                onBlur={() => {
                  validate(email);
                }}
              />
              <Input
                style={styles.formInput}
                status="control"
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                accessoryLeft={LockIcon}
                value={password}
                onChangeText={setPassword}
                onIconPress={onPasswordIconPress}
              />
            </View>

            <Button
              style={styles.signInButton}
              size="giant"
              onPress={onSignInButtonPress}>
              SIGN IN
            </Button>
            <Button
              style={styles.signUpButton}
              appearance="ghost"
              status="control"
              onPress={onSignUpButtonPress}>
              Don't have an account? Sign Up
            </Button>
            <View style={styles.socialAuthContainer}>
              <Text style={styles.socialAuthHintText} status="control">
                Or Sign In Using Social Media
              </Text>
              <View style={styles.socialAuthButtonsContainer}>
                <Button
                  appearance="ghost"
                  size="giant"
                  status="control"
                  accessoryLeft={FacebookIcon}
                />
                <Button
                  appearance="ghost"
                  size="giant"
                  status="control"
                  accessoryLeft={GoogleIcon}
                />
                <Button
                  appearance="ghost"
                  size="giant"
                  status="control"
                  accessoryLeft={TwitterIcon}
                />
              </View>
            </View>
          </ImageOverlay>
        </View>
        {/* </ScrollView> */}
      </View>
    </>
    // {/* </KeyboardAvoidingView> */}
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    minHeight: 216,
    paddingHorizontal: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloLabel: {
    fontSize: 26,
    lineHeight: 32,
  },
  signInLabel: {
    marginTop: 8,
    textAlign: 'center',
  },
  tabContentContainer: {
    padding: 16,
  },
  formInput: {
    marginTop: 16,
  },
  smsCaptionLabel: {
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  signInButton: {
    marginHorizontal: 16,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  select: {
    flex: 1,
    // marginHorizontal: 2,
  },
  socialAuthContainer: {
    marginTop: 24,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  flexContainer: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  roleLabel: {
    alignSelf: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
  },
  errorCaption: {
    color: '#FFE347',
  },
});

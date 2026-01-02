import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry, Icon} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons'; // <--Eva Icons
import {FeatherIconsPack} from './assets/icons/feather-icons'; // <--Import Feather Icons
import {MaterialIconsPack} from './assets/icons/material-icons'; // <-- Import Material icons
import {default as theme} from './assets/themes/custom-theme.json'; // <-- Import app theme
import {default as mapping} from './assets/themes/mapping.json'; // <-- Import app mapping
import configureStore from './redux-store/';
import {Provider} from 'react-redux';
import AppNavigator from './routes/app-navigator';

const store = configureStore();

const FacebookIcon = (props) => <Icon {...props} name="facebook" pack="eva" />;
// packs: eva,material,feather
// npx react-native link [Imp Command to link new 3rd party packages]
// npm start -- --reset-cache
//*********************/
// watchman watch-del-all &&
// rm -rf $TMPDIR/react-native-packager-cache-* &&
// rm -rf $TMPDIR/metro-bundler-cache-* &&
// rm -rf node_modules/
// && npm cache clean --force &&
// npm install &&
// npm start -- --reset-cache
//*********************/
//Sync the ./android folder changes
//Run : "gradlew" and "gradlew --refresh-dependencies"
//*********************/

export default Index = () => (
  <Provider store={store}>
    <IconRegistry icons={[FeatherIconsPack, EvaIconsPack, MaterialIconsPack]} />
    <ApplicationProvider
      {...eva}
      theme={{...eva.light, ...theme}}
      customMapping={mapping}>
      <AppNavigator />
    </ApplicationProvider>
  </Provider>
);

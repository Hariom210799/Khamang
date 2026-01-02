/**
 * Khamang - Food Delivery App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import { FeatherIconsPack } from './src/assets/icons/feather-icons';
import { MaterialIconsPack } from './src/assets/icons/material-icons';
import {default as theme} from './src/assets/themes/custom-theme.json';
import {default as mapping} from './src/assets/themes/mapping.json';
import configureStore from './src/redux-store';
import {Provider} from 'react-redux';
import AppNavigator from './src/routes/app-navigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';

const store = configureStore();

// Reset Redux state on every app start
store.dispatch({ type: 'LOG_USER_OUT' });

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <Provider store={store}>
        <IconRegistry icons={[EvaIconsPack, FeatherIconsPack, MaterialIconsPack]} />
        <ApplicationProvider
          {...eva}
          theme={{...eva.light, ...theme}}
          customMapping={mapping}>
          <AppNavigator />
        </ApplicationProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;

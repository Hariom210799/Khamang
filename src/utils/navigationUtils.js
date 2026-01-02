import {CommonActions} from '@react-navigation/native';

/**
 * Safe navigation reset helper
 * Resets to auth screen from any nested navigator
 * 
 * @param {Object} navigation - The navigation object from props or hook
 */
export const safeResetTo = (navigation) => {
  try {
    // Reset the entire navigation stack to LoginScreen
    navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
  } catch (error) {
    // Fallback: dispatch reset action
    try {
      let rootNav = navigation;
      while (rootNav?.getParent?.()) {
        rootNav = rootNav.getParent();
      }
      
      rootNav?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'LoginScreen'}],
        })
      );
    } catch (e) {
      console.error('Navigation reset failed:', e?.message);
    }
  }
};

/**
 * Navigate to logout (auth screen)
 * @param {Object} navigation - The navigation object from props or hook
 */
export const handleLogout = (navigation) => {
  safeResetTo(navigation);
};

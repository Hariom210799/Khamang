import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import makerMenu from './reducers/maker-menu';
import mainApp from './reducers/main-app';

const rootReducer = combineReducers({
  maker_menu: makerMenu,
  main_app: mainApp,
});

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};

export default configureStore;

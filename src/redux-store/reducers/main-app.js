import {produce} from 'immer';
import {LOG_USER, LOG_USER_OUT} from '../actions/actionTypes';

const initialState = {
  logged_user: {
    token: '',
    email: '',
    id: '',
    role: '',
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
  },
};

const main_app = (state = initialState, action) => {
  switch (action.type) {
    case LOG_USER:
      return produce(state, (draft) => {
        draft.logged_user = action.payload;
      });

    case LOG_USER_OUT:
      return produce(state, (newState) => {
        newState.logged_user = {
          token: '',
          email: '',
          id: '',
          role: '',
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
        };
      });

    default:
      return state;
  }
};

export default main_app;

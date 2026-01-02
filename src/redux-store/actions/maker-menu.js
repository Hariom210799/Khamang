import {
  SELECT_DISH,
  DESELECT_DISH,
  ADD_DISH,
  DELETE_DISH,
  EDIT_DISH,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
  CHECK_DISH,
} from './actionTypes';
import React from 'react';

export const selectDish = (id) => {
  return {
    type: SELECT_DISH,
  };
};

export const deselectDish = () => {
  return {
    type: DESELECT_DISH,
  };
};
export const addDish = () => {
  return {
    type: ADD_DISH,
  };
};
export const deleteDish = () => {
  return {
    type: DELETE_DISH,
  };
};

export const editDish = () => {
  return {
    type: EDIT_DISH,
  };
};
export const addCategory = (payload) => {
  return {
    type: ADD_CATEGORY,
    payload: payload,
  };
};
export const deleteCategory = () => {
  return {
    type: DELETE_CATEGORY,
  };
};
export const editCategory = () => {
  return {
    type: EDIT_CATEGORY,
  };
};

export const checkDish = (id) => {
  return {
    type: CHECK_DISH,
    payload: id,
  };
};

// export const addPlace = (placeName) => {
//   return {
//     type: ADD_PLACE,
//     placeName: placeName,
//   };
// };

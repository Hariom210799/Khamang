import {LOG_USER, LOG_USER_OUT} from './actionTypes';
import React from 'react';

export const logUser = (data) => {
  return {
    type: LOG_USER,
    payload: data,
  };
};

export const logUserOut = (data) => {
  return {
    type: LOG_USER_OUT,
    payload: '',
  };
};

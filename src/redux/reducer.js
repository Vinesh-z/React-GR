import * as types from './actionTypes';

export default function passengerReducer(state = {}, action) {
  switch (action.type) {
    case types.UPDATE_USER:
      return action.user;
    default:
      return state;
  }
}
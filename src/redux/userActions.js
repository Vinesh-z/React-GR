import * as types from './actionTypes';

export function updateAuthenticatedUser(user) {
  return function (dispatch) {
    return dispatch({ type: types.UPDATE_USER, user });
  };
}

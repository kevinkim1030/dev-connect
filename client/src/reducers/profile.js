// Make sure to add profile reducer to 'root reducer' aka index.js
// actions get profile/create/update/clear from state

import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE } from "../actions/types";

// create initial state
const initialState = {
  profile: null,
  // for profile listing page
  profiles: [],
  // place for all github repos
  repos: [],
  // once you make a request - will change loading to false
  loading: true,
  // for any errors in request
  error: {}
}

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      }
    default:
      return state;
  }

}
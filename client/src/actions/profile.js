import axios from 'axios';
// need to set alerts in some places
import { setAlert } from './alert';
import {
  GET_PROFILE,
  PROFILE_ERROR
} from './types';

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  // need to hit GET api/profile/me route to get profile of logged in user
  try {
    const res = await axios.get('/api/profile/me')

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}
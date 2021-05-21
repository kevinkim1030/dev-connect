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

// Create or update a profile
// pass in history obj for push method which will redirect to client side route
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    // since we are sending data - we need a config obj
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // need to hit POST api/profile route to create/update profile
    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if(!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors
    
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}
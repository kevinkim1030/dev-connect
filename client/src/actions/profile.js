import axios from 'axios';
import { ResultWithContext } from 'express-validator/src/chain';
// need to set alerts in some places
import { setAlert } from './alert';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE
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
};

// Add Experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    // since we are sending data - we need a config obj
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // need to hit PUT api/profile/experience route to create/update profile
    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Added', 'success'));

      history.push('/dashboard')
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

// Add Education

export const addEducation = (formData, history) => async dispatch => {
  try {
    // since we are sending data - we need a config obj
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // need to hit PUT api/profile/education route to create/update profile
    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    
    dispatch(setAlert('Education Added', 'success'));

      history.push('/dashboard')
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
};

// Delete experience
// @route   DELETE api/profile/experience/:exp_id
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete education
// @route    DELETE api/profile/education/:edu_id
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete account & profile

export const deleteAccount = id => async dispatch => {
  if(window.confirm('Are you sure? This can NOT be undone!')){
    
    try {
      const res = await axios.delete('/api/profile');
  
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
  
      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

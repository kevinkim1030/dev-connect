import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';

export default combineReducers({
  // to add anything to app
    // create new reducer/actions file/component
  alert,
  auth,
  profile,
  post
});
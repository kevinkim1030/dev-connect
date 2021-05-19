import axios from 'axios';

// A function that takes in a token
// if token is there it will add it to the headers
// if not it will delete it from the headers

const setAuthToken = token => {
  if(token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;
import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
// in order to interact with the auth state/reducer
// make sure to change the export default on bottom
import { connect } from 'react-redux';

// destructuring - in order to get any other parameters that come in via '...rest'
const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => (
  <Route 
    {...rest} 
    render={props => 
      !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : 
        (<Component {...props} />)
    }
  />
);

PrivateRoute.propTypes = {
  //add all the state from the auth reducer into proptypes
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  // to pull in all the state from the auth reducer
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);

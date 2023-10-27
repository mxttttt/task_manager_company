import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, loggedIn, user, ...rest }) => {
  return <Route {...rest} render={(props) => (loggedIn && user ? <Component {...props} user={user} /> : <Redirect to="/login" />)} />;
};

export default PrivateRoute;

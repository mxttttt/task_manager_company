import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, loggedIn, user, ...rest }) => {
  return loggedIn && user ? <Component {...rest} user={user} /> : <Navigate to="/login" />;
};

export default PrivateRoute;

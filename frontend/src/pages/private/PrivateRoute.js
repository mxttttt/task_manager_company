import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, user, ...rest }) => {
  return user ? <Component {...rest} user={user} /> : <Navigate to="/login" />;
};

export default PrivateRoute;

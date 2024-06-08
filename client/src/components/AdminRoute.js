// AdminRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../index';

const AdminRoute = ({ element }) => {
  const { user } = useContext(Context);

  if (user.user && user.user.role === 'Admin') {
    return element;
  }

  return <Navigate to="/myacount" />;
};

export default AdminRoute;

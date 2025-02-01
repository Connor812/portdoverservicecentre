import React from 'react';
import { Navigate } from 'react-router-dom';
import { Authentication } from '../auth/Auth.js';

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = Authentication();
    return isAuthenticated.status ? element : <Navigate to={`/admin/${isAuthenticated.message}`} />;
};

export default ProtectedRoute;
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Chargement...</div>; 
    }

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Ajout du chargement initial

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false); // Fin du chargement une fois les données récupérées
    }, []);

    const login = (value) => {
        localStorage.setItem('token', value.token);
        localStorage.setItem('user', JSON.stringify(value.user));
        setToken(value.token);
        setUser(value.user);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading, // Ajouter l'état de chargement au contexte
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

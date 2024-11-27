import React, { useState, createContext } from 'react';

const defaultTheme = window.localStorage.getItem('theme');
const ThemeContext = createContext(defaultTheme);
const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(defaultTheme);

    const toggleTheme = (value) => {
        window.localStorage.setItem('theme', value);
        setTheme(value);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };

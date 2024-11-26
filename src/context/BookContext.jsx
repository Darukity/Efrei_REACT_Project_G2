import React, { useState, createContext } from 'react';

const BookContext = createContext('');
const BookProvider = ({ children }) => {
    const [favoriteBook, setFavoriteBook] = useState('');

    const updateFavoriteBook = (value) => {
        setFavoriteBook(value);
    };

    return (
        <BookContext.Provider
            value={{
                favoriteBook,
                updateFavoriteBook
            }}
        >
            {children}
        </BookContext.Provider>
    );
};

export { BookContext, BookProvider };

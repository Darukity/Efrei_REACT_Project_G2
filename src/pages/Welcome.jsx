import React, { useContext, useState } from 'react';
import Bonjour from '../components/Bonjour.jsx';
import MultipleFive from '../components/MultipleFive.jsx';
import Counter from '../components/Counter.jsx';
import { BookContext } from '../context/BookContext.jsx';

function Welcome() {
    const { favoriteBook } = useContext(BookContext);
    const [name, setName] = useState('');

    return (
        <div className="container-fluid h-auto vh-100">
            <Bonjour name={name} setName={setName} />
            {favoriteBook && (
                <p>
                    My favorite book is <b>{favoriteBook}</b>
                </p>
            )}
            <MultipleFive />
            <Counter />
        </div>
    );
}

export default Welcome;

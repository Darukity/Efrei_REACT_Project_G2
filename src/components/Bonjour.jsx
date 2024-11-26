import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext.jsx';

Bonjour.propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired
};

function Bonjour({ setName }) {
    const { user } = useContext(AuthContext);

    return (
        <div className="card">
            <h1>
                Bonjour {user?.lastname} {user?.firstname}
            </h1>
            <input type="text" onChange={(event) => setName(event.target.value)} />
        </div>
    );
}

export default Bonjour;

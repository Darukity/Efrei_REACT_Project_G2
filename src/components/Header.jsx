import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ToggleButton from './ToggleButton.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary p-3 ">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    Navbar
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active">
                                <Link to={'/'}>Home</Link>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active">
                                <Link to={'/welcome'}>Welcome</Link>
                            </a>
                        </li>
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link active">
                                        <Link to={'/users'}>Users</Link>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active">
                                        <Link to={'/create-book'}>Creez un Livre</Link>
                                    </a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link active">
                                        <Link to={'/'} onClick={logout}>
                                            Logout
                                        </Link>
                                    </a>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link active">
                                        <Link to={'/login'}>Login</Link>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active">
                                        <Link to={'/register'}>Register</Link>
                                    </a>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <ToggleButton />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;

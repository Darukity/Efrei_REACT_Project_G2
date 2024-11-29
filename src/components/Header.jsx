import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import { AuthContext } from '../context/AuthContext.jsx';

function Header() {
    const {user, logout} = useContext(AuthContext);

    return (
        <header className="header-container">
            <div className="header-left">
                <img src="https://st2.depositphotos.com/16030310/43120/v/450/depositphotos_431201414-stock-illustration-letter-logo-colorful-geometric-shape.jpg" alt="Logo du site" className="site-logo" />
                <h1 className="site-title">Générateur de CV</h1>
            </div>
            <nav className="header-nav">
                <ul className="nav-links">
                    <li>
                        <Link to="/">Accueil</Link>
                    </li>
                    <li>
                        <Link to="/browse-cvs">Consulter CVs</Link>
                    </li>
                    {user && (
                        <>
                            <li>
                                <Link to="/create-cv">Créer CV</Link>
                            </li>
                            <li>
                                <Link to="/my-cv">Mon CV</Link>
                            </li>

                        </>
                    )}
                </ul>
            </nav>
            <div className="header-right">
                {user ? (
                    <>
                        <Link to="/profil" className="auth-button">Profil</Link>
                        <button className="auth-button" onClick={logout}>
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="auth-button">
                            Connexion
                        </Link>
                        <Link to="/register" className="auth-button">
                            Inscription
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;

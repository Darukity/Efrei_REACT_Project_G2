import React, { useContext } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import '../css/Login.css'; // Fichier CSS pour les styles

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    return (
        <div className="login-container">
            <h1>Connexion</h1>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('Adresse email invalide')
                        .required('Ce champ est requis'),
                    password: Yup.string()
                        .required('Ce champ est requis'),
                })}
                onSubmit={async (values) => {
                    try {
                        const response = await fetch(
                            'https://efrei-api-rest-project-g2.onrender.com/api/auth/login',
                            {
                                method: 'POST',
                                body: JSON.stringify(values),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );
                        if (!response.ok) {
                            throw new Error(`Erreur HTTP ! Status: ${response.status}`);
                        }
                        const { user } = await response.json();
                        const { name, email, token } = user;
                        login({
                            user: {
                                name,
                                email,
                            },
                            token,
                        });
                        toast.success('Vous êtes connectés !');
                        navigate('/welcome');
                    } catch (error) {
                        console.error('Échec de la connexion :', error);
                        toast.error('Échec de la connexion !');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="login-form">
                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email">Email :</label>
                            <Field
                                className="form-control"
                                type="email"
                                name="email"
                                placeholder="Votre adresse email"
                            />
                            <ErrorMessage
                                style={{ color: 'red' }}
                                name="email"
                                component="div"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe :</label>
                            <Field
                                className="form-control"
                                type="password"
                                name="password"
                                placeholder="Votre mot de passe"
                            />
                            <ErrorMessage
                                style={{ color: 'red' }}
                                name="password"
                                component="div"
                            />
                        </div>

                        {/* Bouton de soumission */}
                        <button
                            className="btn btn-primary mt-3"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Connexion
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;

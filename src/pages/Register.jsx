import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import '../css/Register.css'; // Fichier CSS pour les styles

function Register() {
    const navigate = useNavigate();

    return (
        <div className="register-container">
            <h1>Inscription</h1>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    password: '',
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .max(50, 'Le nom doit contenir 50 caractères ou moins')
                        .required('Ce champ est requis'),
                    email: Yup.string()
                        .email('Adresse email invalide')
                        .required('Ce champ est requis'),
                    password: Yup.string()
                        .matches(
                            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/,
                            'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.'
                        )
                        .required('Ce champ est requis'),
                })}
                onSubmit={async (values) => {
                    try {
                        console.log("ici");
                        const response = await fetch(
                            'https://efrei-api-rest-project-g2.onrender.com/api/auth/register',
                            {
                                method: 'POST',
                                body: JSON.stringify(values),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        );
                        const data = await response.json();
                        if (!response.ok) {
                            throw new Error(
                                `Erreur HTTP ! Status: ${response.status} ${data.error}`
                            );
                        }
                        alert('Compte créé avec succès');
                        navigate('/login');
                    } catch (error) {
                        console.error('Échec de l\'inscription :', error);
                    }
                }}
            >
                <Form className="register-form">
                    {/* Nom */}
                    <div className="form-group">
                        <label htmlFor="name">Nom :</label>
                        <Field
                            className="form-control"
                            type="text"
                            name="name"
                            placeholder="Votre nom"
                        />
                        <ErrorMessage
                            style={{ color: 'red' }}
                            name="name"
                            component="div"
                        />
                    </div>

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

                    <button className="btn btn-primary mt-3" type="submit">
                        S'inscrire
                    </button>
                </Form>
            </Formik>
        </div>
    );
}

export default Register;

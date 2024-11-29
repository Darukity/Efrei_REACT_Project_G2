import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import '../css/Profil.css'; // Fichier CSS pour les styles

function Profil() {
    const { user, updateUser , token} = useContext(AuthContext); // Assume user info is stored in AuthContext
    
    const [editMode, setEditMode] = useState(false);

    const initialValues = {
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || ''
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Le nom est requis."),
        email: Yup.string()
            .email("Adresse e-mail invalide.")
            .required("L'email est requis."),
        password: Yup.string()
            .required("Le mot de passe est requis.")
            .matches(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
            )
            .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/user/${user.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // Include auth token if required
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedUser = await response.json();
            updateUser(updatedUser); // Update user in context
            toast.success('Profil mis à jour avec succès !');
            setEditMode(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            toast.error('Échec de la mise à jour du profil.');
        }
    };

    return (
        <div className="container mt-5 profile-page">
            <h1 className="text-center mb-4">Mon Profil</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group mb-3">
                            <label htmlFor="name">Name :</label>
                            <Field
                                className="form-control"
                                type="text"
                                name="name"
                                disabled={!editMode}
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email :</label>
                            <Field
                                className="form-control"
                                type="email"
                                name="email"
                                disabled={!editMode}
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password :</label>
                            <Field
                                className="form-control"
                                type="text"
                                name="password"
                                disabled={!editMode}
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        {editMode ? (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                Sauvegarder
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditMode(true)}
                            >
                                Modifier
                            </button>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Profil;

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik, FieldArray } from 'formik';
import { AuthContext } from '../context/AuthContext.jsx';
import '../css/MyCv.css';
import * as Yup from 'yup';

function MyCv() {
    const { user, updateUser , token} = useContext(AuthContext);
    
    const navigate = useNavigate();
    const [cv, setCv] = useState(null);
    const [cvNotFound, setCvNotFound] = useState(false);

    useEffect(() => {
        const fetchCv = async () => {
            try {
                const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/user/${user.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        setCvNotFound(true); // CV non trouvé
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    setCv(data);
                }
            } catch (error) {
                console.error('Failed to fetch CV:', error);
                setCvNotFound(true);
            }
        };

        fetchCv();
    }, [user.id]);

    const deleteCV = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.')) {
            try {
                const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${user.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                alert('CV supprimé avec succès !');
                navigate('/'); // Redirection après suppression
            } catch (error) {
                console.error('Failed to delete CV:', error);
                alert('Échec de la suppression du CV.');
            }
        }
    };

    if (cvNotFound) {
        return (
            <div className="no-cv-container">
                <h2>Aucun CV trouvé</h2>
                <p>
                    Vous n'avez pas encore créé de CV. Cliquez{' '}
                    <Link to="/create-cv" className="btn btn-link">
                        ICI
                    </Link>{' '}
                    pour créer un nouveau CV.
                </p>
            </div>
        );
    }

    if (!cv) {
        return <p>Chargement...</p>;
    }

    const initialValues = {
        personalInfo: cv.personalInfo || {
            firstName: '',
            lastName: '',
            description: '',
        },
        education: cv.education || [],
        experience: cv.experience || [],
        isVisible: cv.isVisible || false,
    };

    const validationSchema = Yup.object({
        personalInfo: Yup.object({
            firstName: Yup.string().required('Prénom requis'),
            lastName: Yup.string().required('Nom requis'),
            description: Yup.string().required('Description requise'),
        }),
        education: Yup.array().of(
            Yup.object({
                degree: Yup.string().required('Diplôme requis'),
                institution: Yup.string().required('Établissement requis'),
                year: Yup.number()
                    .required('Année requise')
                    .min(1900, 'Année invalide')
                    .max(new Date().getFullYear(), 'Année future invalide'),
            })
        ),
        experience: Yup.array().of(
            Yup.object({
                jobTitle: Yup.string().required('Titre de poste requis'),
                company: Yup.string().required('Entreprise requise'),
                years: Yup.number()
                    .required('Nombre d’années requis')
                    .min(0, 'Années invalides'),
            })
        ),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert('CV mis à jour avec succès !');
        } catch (error) {
            console.error('Failed to update CV:', error);
            alert('Échec de la mise à jour du CV.');
        }
    };

    return (
        <div className="view-edit-cv-container">
            <h1>Afficher et Modifier le CV</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange }) => (
                    <Form>
                        {/* Informations personnelles */}
                        <div className="form-section">
                            <h2>Informations personnelles</h2>
                            <label>Prénom :</label>
                            <Field
                                className="form-control"
                                type="text"
                                name="personalInfo.firstName"
                                placeholder="Prénom"
                            />
                            <label>Nom :</label>
                            <Field
                                className="form-control"
                                type="text"
                                name="personalInfo.lastName"
                                placeholder="Nom"
                            />
                            <label>Description :</label>
                            <Field
                                as="textarea"
                                className="form-control"
                                name="personalInfo.description"
                                placeholder="Décrivez-vous"
                            />
                        </div>

                        {/* Éducation */}
                        <div className="form-section">
                            <h2>Éducation</h2>
                            <FieldArray name="education">
                                {({ remove, push }) => (
                                    <>
                                        {values.education.map((edu, index) => (
                                            <div key={index} className="nested-form-group">
                                                <label>Diplôme :</label>
                                                <Field
                                                    className="form-control"
                                                    name={`education.${index}.degree`}
                                                    placeholder="Diplôme"
                                                />
                                                <label>Établissement :</label>
                                                <Field
                                                    className="form-control"
                                                    name={`education.${index}.institution`}
                                                    placeholder="Établissement"
                                                />
                                                <label>Année :</label>
                                                <Field
                                                    className="form-control"
                                                    type="number"
                                                    name={`education.${index}.year`}
                                                    placeholder="Année"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger button-cv"
                                                    onClick={() => remove(index)}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-secondary button-cv"
                                            onClick={() => push({ degree: '', institution: '', year: '' })}
                                        >
                                            Ajouter une éducation
                                        </button>
                                    </>
                                )}
                            </FieldArray>
                        </div>

                        {/* Expérience */}
                        <div className="form-section">
                            <h2>Expérience</h2>
                            <FieldArray name="experience">
                                {({ remove, push }) => (
                                    <>
                                        {values.experience.map((exp, index) => (
                                            <div key={index} className="nested-form-group">
                                                <label>Poste :</label>
                                                <Field
                                                    className="form-control"
                                                    name={`experience.${index}.jobTitle`}
                                                    placeholder="Poste"
                                                />
                                                <label>Entreprise :</label>
                                                <Field
                                                    className="form-control"
                                                    name={`experience.${index}.company`}
                                                    placeholder="Entreprise"
                                                />
                                                <label>Années :</label>
                                                <Field
                                                    className="form-control"
                                                    type="number"
                                                    name={`experience.${index}.years`}
                                                    placeholder="Années"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger button-cv"
                                                    onClick={() => remove(index)}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-secondary button-cv"
                                            onClick={() => push({ jobTitle: '', company: '', years: '' })}
                                        >
                                            Ajouter une expérience
                                        </button>
                                    </>
                                )}
                            </FieldArray>
                        </div>

                        {/* Visibilité */}
                        <div className="form-section">
                            <label>
                                <Field
                                    type="checkbox"
                                    name="isVisible"
                                    checked={values.isVisible}
                                    onChange={handleChange}
                                />
                                Rendre le CV public
                            </label>
                        </div>

                        <button className="btn btn-primary mt-3 button-cv" type="submit">
                            Enregistrer
                        </button>
                    </Form>
                )}
            </Formik>
            <button className="btn btn-danger mt-3 button-cv" onClick={deleteCV}>
                Supprimer ce CV
            </button>
        </div>
    );
}

export default MyCv;

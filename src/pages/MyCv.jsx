import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik, FieldArray } from 'formik';
import { AuthContext } from '../context/AuthContext.jsx';
import '../css/MyCv.css';
import * as Yup from 'yup';

function MyCv() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cvs, setCvs] = useState([]);
    const [cvNotFound, setCvNotFound] = useState(false);

    useEffect(() => {
        const fetchCvs = async () => {
            try {
                const response = await fetch(
                    `https://efrei-api-rest-project-g2.onrender.com/api/cv/user/${user.id}`,
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!response.ok) {
                    if (response.status === 404) setCvNotFound(true);
                    else throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                    const data = await response.json();
                    setCvs(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                }
            } catch (error) {
                console.error('Failed to fetch CVs:', error);
                setCvNotFound(true);
            }
        };

        fetchCvs();
    }, [user.id, token]);

    const deleteCV = async (cvId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
            try {
                const response = await fetch(
                    `https://efrei-api-rest-project-g2.onrender.com/api/cv/${cvId}`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                alert('CV supprimé avec succès !');
                setCvs(cvs.filter((cv) => cv._id !== cvId)); // Mettre à jour l'état local
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
                    <Link to="/create-cv" className="btn-link">
                        ici
                    </Link>{' '}
                    pour en créer un.
                </p>
            </div>
        );
    }

    if (!cvs.length) {
        return <p>Chargement...</p>;
    }

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
                jobTitle: Yup.string().required('Poste requis'),
                company: Yup.string().required('Entreprise requise'),
                years: Yup.number()
                    .required('Années requises')
                    .min(0, 'Années invalides'),
            })
        ),
    });

    const handleSubmit = async (values, cvId) => {
        try {
            const response = await fetch(
                `https://efrei-api-rest-project-g2.onrender.com/api/cv/${cvId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                }
            );
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            alert('CV mis à jour avec succès !');
        } catch (error) {
            console.error('Failed to update CV:', error);
            alert('Échec de la mise à jour du CV.');
        }
    };

    return (
        <div className="my-cv-container">
            <h1>Gérer mes CV</h1>
            {cvs.map((cv) => (
                <div key={cv._id} className="cv-item">
                    <button
                        onClick={() => navigate(`/CvViewer/${cv._id}`)}
                        className="mycv-button mycv-button-navigate"
                    >
                        Voir le CV formaté et les commentaires reçus
                    </button>
                    <Formik
                        initialValues={{
                            personalInfo: cv.personalInfo || { firstName: '', lastName: '', description: '' },
                            education: cv.education || [],
                            experience: cv.experience || [],
                            isVisible: cv.isVisible || false,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleSubmit(values, cv._id)}
                    >
                        {({ values, handleChange }) => (
                            <Form>
                                <div>
                                    <h2 className="top_space">Informations personnelles</h2>
                                    <Field name="personalInfo.firstName" placeholder="Prénom" />
                                    <Field name="personalInfo.lastName" placeholder="Nom" />
                                    <Field name="personalInfo.description" placeholder="Description" />
                                </div>

                                <div>
                                    <h2 className="top_space">Éducation</h2>
                                    <FieldArray name="education">
                                        {({ remove, push }) => (
                                            <>
                                                {values.education.map((_, index) => (
                                                    <div key={index}>
                                                        <Field
                                                            name={`education.${index}.degree`}
                                                            placeholder="Diplôme"
                                                        />
                                                        <Field
                                                            name={`education.${index}.institution`}
                                                            placeholder="Établissement"
                                                        />
                                                        <Field
                                                            name={`education.${index}.year`}
                                                            placeholder="Année"
                                                            type="number"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="mycv-button mycv-button-remove"
                                                            onClick={() => remove(index)}
                                                        >
                                                            Retirer
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="mycv-button mycv-button-add"
                                                    onClick={() => push({ degree: '', institution: '', year: '' })}
                                                >
                                                    Ajouter une éducation
                                                </button>
                                            </>
                                        )}
                                    </FieldArray>
                                </div>

                                <div>
                                    <h2 className="top_space">Expérience</h2>
                                    <FieldArray name="experience">
                                        {({ remove, push }) => (
                                            <>
                                                {values.experience.map((_, index) => (
                                                    <div key={index}>
                                                        <Field
                                                            name={`experience.${index}.jobTitle`}
                                                            placeholder="Poste"
                                                        />
                                                        <Field
                                                            name={`experience.${index}.company`}
                                                            placeholder="Entreprise"
                                                        />
                                                        <Field
                                                            name={`experience.${index}.years`}
                                                            placeholder="Années"
                                                            type="number"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="mycv-button mycv-button-remove"
                                                            onClick={() => remove(index)}
                                                        >
                                                            Retirer
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="mycv-button mycv-button-add"
                                                    onClick={() => push({ jobTitle: '', company: '', years: '' })}
                                                >
                                                    Ajouter une expérience
                                                </button>
                                            </>
                                        )}
                                    </FieldArray>
                                </div>

                                <div>
                                    <label>
                                        <Field
                                            type="checkbox"
                                            name="isVisible"
                                            onChange={handleChange}
                                        />
                                        Rendre le CV public
                                    </label>
                                </div>

                                <button type="submit" className="mycv-button mycv-button-save">
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteCV(cv._id)}
                                    className="mycv-button mycv-button-delete"
                                >
                                    Supprimer ce CV
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <div className='separation'></div>
                </div>
                
            ))}
        </div>
    );
}

export default MyCv;

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Form, Formik, FieldArray } from 'formik';
import { AuthContext } from '../context/AuthContext.jsx';
import '../css/MyCv.css';
import * as Yup from 'yup';

function MyCv() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cv, setCv] = useState(null);
    const [cvNotFound, setCvNotFound] = useState(false);

    useEffect(() => {
        const fetchCv = async () => {
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
                    setCv(data);
                }
            } catch (error) {
                console.error('Failed to fetch CV:', error);
                setCvNotFound(true);
            }
        };

        fetchCv();
    }, [user.id, token]);


    const deleteCV = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
            try {
                const response = await fetch(
                    `https://efrei-api-rest-project-g2.onrender.com/api/cv/${cv[0]._id}`,
                    {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                alert('CV supprimé avec succès !');
                navigate('/');
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

    if (!cv) {
        return <p>Chargement...</p>;
    }
    
    const initialValues = {
        personalInfo: cv[0].personalInfo || { firstName: '', lastName: '', description: '' },
        education: cv[0].education || [],
        experience: cv[0].experience || [],
        isVisible: cv[0].isVisible || false,
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
                jobTitle: Yup.string().required('Poste requis'),
                company: Yup.string().required('Entreprise requise'),
                years: Yup.number()
                    .required('Années requises')
                    .min(0, 'Années invalides'),
            })
        ),
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch(
                `https://efrei-api-rest-project-g2.onrender.com/api/cv/${cv[0]._id}`,
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
            <button onClick={navigate(`/CvViewer/${cv[0]._id}`)} className="mycv-button mycv-button-navigate">
                Voir mon CV formater et les commentaires recu
             </button>
            <h1>Gérer mon CV</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, handleChange }) => (
                    <Form>
                        <div>
                            <h2 className='top_space'>Informations personnelles</h2>
                            <FieldArray name="personalInfo">
                                {({ remove, push }) => (
                                    <>
                                        <Field name={`personalInfo.firstName`} placeholder="firstName" />
                                        <Field name={`personalInfo.lastName`} placeholder="lastName" />
                                        <Field name={`personalInfo.description`} placeholder="description" />
                                        <button
                                            type="button"
                                            className="mycv-button mycv-button-remove"
                                            onClick={() => remove(index)}
                                            >
                                            Retirer
                                        </button>
                                            
                                        <button
                                            type="button"
                                            className="mycv-button mycv-button-add"
                                            onClick={() => push({ firstName: '', lastName: '', description: '' })}
                                        >
                                            Ajouter une personalInfo
                                        </button>
                                    </>
                                )}
                            </FieldArray>
                        </div>

                        <div>
                            <h2 className='top_space'>Éducation</h2>
                            <FieldArray name="education">
                                {({ remove, push }) => (
                                    <>
                                        {values.education.map((_, index) => (
                                            <div key={index}>
                                                <Field name={`education.${index}.degree`} placeholder="Diplôme" />
                                                <Field name={`education.${index}.institution`} placeholder="Établissement" />
                                                <Field name={`education.${index}.year`} placeholder="Année" type="number" />
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
                            <h2 className='top_space'>Expérience</h2>
                            <FieldArray name="experience">
                                {({ remove, push }) => (
                                    <>
                                        {values.experience.map((_, index) => (
                                            <div key={index}>
                                                <Field name={`experience.${index}.jobTitle`} placeholder="Poste" />
                                                <Field name={`experience.${index}.company`} placeholder="Entreprise" />
                                                <Field name={`experience.${index}.years`} placeholder="Années" type="number" />
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
                                <Field type="checkbox" name="isVisible" onChange={handleChange} />
                                Rendre le CV public
                            </label>
                        </div>

                        <button type="submit" className="mycv-button mycv-button-save">
                            Enregistrer
                        </button>
                        <button onClick={deleteCV} className="mycv-button mycv-button-delete">
                            Supprimer mon CV
                        </button>
                    </Form>
                )}
            </Formik>
        </div>

            );
        }
export default MyCv;

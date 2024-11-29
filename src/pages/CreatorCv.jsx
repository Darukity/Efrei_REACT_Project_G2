import React, { useContext, useState } from 'react';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext.jsx';
import '../css/Creator.css'; 

const CreatorCv = () => {
    const { user, updateUser , token} = useContext(AuthContext);
    
    const initialValues = {
        userId: user.id,
        personalInfo: {
            firstName: '',
            lastName: '',
            description: '',
        },
        education: [
            {
                degree: '',
                institution: '',
                year: '',
            },
        ],
        experience: [
            {
                jobTitle: '',
                company: '',
                years: '',
            },
        ],
        isVisible: true,
    };

    const validationSchema = Yup.object({
        personalInfo: Yup.object({
            firstName: Yup.string().required('Prénom requis'),
            lastName: Yup.string().required('Nom requis'),
            description: Yup.string(),
        }),
        education: Yup.array().of(
            Yup.object({
                degree: Yup.string().required('Diplôme requis'),
                institution: Yup.string().required('Institution requise'),
                year: Yup.number()
                    .min(1900, 'L\'année doit être >= 1900')
                    .max(new Date().getFullYear(), 'L\'année ne peut pas être dans le futur')
                    .required('Année requise'),
            })
        ),
        experience: Yup.array().of(
            Yup.object({
                jobTitle: Yup.string().required('Titre du poste requis'),
                company: Yup.string().required('Entreprise requise'),
                years: Yup.number()
                    .min(0, 'Les années doivent être >= 0')
                    .max(50, 'Les années doivent être <= 50')
                    .required('Nombre d\'années requis'),
            })
        ),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
        try {
            const response = await fetch('https://efrei-api-rest-project-g2.onrender.com/api/cv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue.');
            }

            alert('Votre CV a été enregistré avec succès !');
            resetForm();
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-cv-container">
            <h1 className="creator-h1">Créer votre CV</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting }) => (
                    <Form>
                        {/* Informations personnelles */}
                        <section className="form-section">
                            <h2>Informations personnelles</h2>
                            <div>
                                <label>Prénom:</label>
                                <Field name="personalInfo.firstName" />
                                <ErrorMessage
                                    name="personalInfo.firstName"
                                    component="div"
                                    className="field-error"
                                />
                            </div>
                            <div>
                                <label>Nom:</label>
                                <Field name="personalInfo.lastName" />
                                <ErrorMessage
                                    name="personalInfo.lastName"
                                    component="div"
                                    className="field-error"
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <Field as="textarea" name="personalInfo.description" />
                            </div>
                        </section>

                        {/* Éducation */}
                        <section className="form-section">
                            <h2>Éducation</h2>
                            <FieldArray name="education">
                                {({ remove, push }) => (
                                    <>
                                        {values.education.map((edu, index) => (
                                            <div key={index} className="form-subsection">
                                                <div>
                                                    <label>Diplôme:</label>
                                                    <Field
                                                        name={`education[${index}].degree`}
                                                    />
                                                    <ErrorMessage
                                                        name={`education[${index}].degree`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Institution:</label>
                                                    <Field
                                                        name={`education[${index}].institution`}
                                                    />
                                                    <ErrorMessage
                                                        name={`education[${index}].institution`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Année:</label>
                                                    <Field
                                                        name={`education[${index}].year`}
                                                        type="number"
                                                    />
                                                    <ErrorMessage
                                                        name={`education[${index}].year`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                >
                                                    Retirer
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                push({
                                                    degree: '',
                                                    institution: '',
                                                    year: '',
                                                })
                                            }
                                        >
                                            Ajouter une éducation
                                        </button>
                                    </>
                                )}
                            </FieldArray>
                        </section>

                        {/* Expérience */}
                        <section className="form-section">
                            <h2>Expérience</h2>
                            <FieldArray name="experience">
                                {({ remove, push }) => (
                                    <>
                                        {values.experience.map((exp, index) => (
                                            <div key={index} className="form-subsection">
                                                <div>
                                                    <label>Titre du poste:</label>
                                                    <Field
                                                        name={`experience[${index}].jobTitle`}
                                                    />
                                                    <ErrorMessage
                                                        name={`experience[${index}].jobTitle`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Entreprise:</label>
                                                    <Field
                                                        name={`experience[${index}].company`}
                                                    />
                                                    <ErrorMessage
                                                        name={`experience[${index}].company`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Nombre d'Année travaillé:</label>
                                                    <Field
                                                        name={`experience[${index}].years`}
                                                        type="number"
                                                    />
                                                    <ErrorMessage
                                                        name={`experience[${index}].years`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                >
                                                    Retirer
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                push({
                                                    jobTitle: '',
                                                    company: '',
                                                    years: '',
                                                })
                                            }
                                        >
                                            Ajouter une expérience
                                        </button>
                                    </>
                                )}
                            </FieldArray>
                        </section>

                        {/* Visibilité */}
                        <section className="form-section">
                            <h2>Visibilité</h2>
                            <label>
                                <Field type="checkbox" name="isVisible" />
                                Rendre mon CV visible
                            </label>
                        </section>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le CV'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreatorCv;

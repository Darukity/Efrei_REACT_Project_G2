import React, { useState } from 'react';
import '../css/Creator.css'; // Import du fichier CSS

function CreatorCv() {
    const [formData, setFormData] = useState({
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
    });

    const handleInputChange = (e, section, index, key) => {
        const value = e.target.value;
        if (section === 'personalInfo') {
            setFormData({
                ...formData,
                personalInfo: {
                    ...formData.personalInfo,
                    [key]: value,
                },
            });
        } else {
            const updatedSection = formData[section].map((item, idx) =>
                idx === index ? { ...item, [key]: value } : item
            );
            setFormData({ ...formData, [section]: updatedSection });
        }
    };

    const addSectionItem = (section) => {
        const newItem =
            section === 'education'
                ? { degree: '', institution: '', year: '' }
                : { jobTitle: '', company: '', years: '' };
        setFormData({ ...formData, [section]: [...formData[section], newItem] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('CV Data:', formData);
        alert('Votre CV a été enregistré avec succès !');
    };

    return (
        <div className="create-cv-container">
            <div class="creator-h1">Créer votre CV</div>
            <form onSubmit={handleSubmit}>
                {/* Informations personnelles */}
                <section className="form-section">
                    <h2>Informations personnelles</h2>
                    <label>
                        Prénom:
                        <input
                            type="text"
                            value={formData.personalInfo.firstName}
                            onChange={(e) =>
                                handleInputChange(e, 'personalInfo', null, 'firstName')
                            }
                        />
                    </label>
                    <label>
                        Nom:
                        <input
                            type="text"
                            value={formData.personalInfo.lastName}
                            onChange={(e) =>
                                handleInputChange(e, 'personalInfo', null, 'lastName')
                            }
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={formData.personalInfo.description}
                            onChange={(e) =>
                                handleInputChange(e, 'personalInfo', null, 'description')
                            }
                        />
                    </label>
                </section>

                {/* Éducation */}
                <section className="form-section">
                    <h2>Éducation</h2>
                    {formData.education.map((edu, index) => (
                        <div key={index} className="form-subsection">
                            <label>
                                Diplôme:
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) =>
                                        handleInputChange(e, 'education', index, 'degree')
                                    }
                                />
                            </label>
                            <label>
                                Institution:
                                <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) =>
                                        handleInputChange(e, 'education', index, 'institution')
                                    }
                                />
                            </label>
                            <label>
                                Année:
                                <input
                                    type="number"
                                    value={edu.year}
                                    onChange={(e) =>
                                        handleInputChange(e, 'education', index, 'year')
                                    }
                                />
                            </label>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addSectionItem('education')}
                        className="add-button"
                    >
                        Ajouter une éducation
                    </button>
                </section>

                {/* Expérience */}
                <section className="form-section">
                    <h2>Expérience</h2>
                    {formData.experience.map((exp, index) => (
                        <div key={index} className="form-subsection">
                            <label>
                                Titre du poste:
                                <input
                                    type="text"
                                    value={exp.jobTitle}
                                    onChange={(e) =>
                                        handleInputChange(e, 'experience', index, 'jobTitle')
                                    }
                                />
                            </label>
                            <label>
                                Entreprise:
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) =>
                                        handleInputChange(e, 'experience', index, 'company')
                                    }
                                />
                            </label>
                            <label>
                                Années:
                                <input
                                    type="number"
                                    value={exp.years}
                                    onChange={(e) =>
                                        handleInputChange(e, 'experience', index, 'years')
                                    }
                                />
                            </label>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addSectionItem('experience')}
                        className="add-button"
                    >
                        Ajouter une expérience
                    </button>
                </section>

                {/* Visibilité */}
                <section className="form-section">
                    <h2>Visibilité</h2>
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.isVisible}
                            onChange={(e) =>
                                setFormData({ ...formData, isVisible: e.target.checked })
                            }
                        />
                        Rendre mon CV visible
                    </label>
                </section>

                <button type="submit" className="submit-button">
                    Enregistrer le CV
                </button>
            </form>
        </div>
    );
}

export default CreatorCv;

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import "../css/CvViewer.css"; // Importer le fichier CSS spécifique

const CvViewer = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const { user, updateUser , token} = useContext(AuthContext);

    const navigate = useNavigate(); // Pour rediriger
    const [cvData, setCvData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCv = async () => {
            try {
                const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${id}`,
                    {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                    }
                );
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error('Unauthorized to see this CV');
                    }
                    throw new Error('Failed to fetch CV');
                }
                const data = await response.json();
                setCvData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCv();
    }, [id]);

    if (error) {
        if (error === 'Unauthorized to see this CV') {
            navigate('/login'); // Redirige vers la liste si accès interdit
            return null;
        }
        return <div className="cv-viewer-error">{error}</div>;
    }

    if (!cvData) {
        return <div className="cv-viewer-loading">Chargement...</div>;
    }
    console.log("user id = ", user.id)
    console.log("user id depuis cv = ", user.id)
    return (
        <div className="cv-viewer-container">
            <header className="cv-viewer-header">
                <h1>Visualisation du CV</h1>
            </header>
            <main className="cv-viewer-content">
                <section className="cv-viewer-section">
                    <h2 className="cv-viewer-name">
                        {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                    </h2>
                    <p className="cv-viewer-description">{cvData.personalInfo.description}</p>
                </section>
                <section className="cv-viewer-section">
                    <h3 className="cv-viewer-subheading">Éducation</h3>
                    <ul className="cv-viewer-list">
                        {cvData.education.map((edu, index) => (
                            <li key={index} className="cv-viewer-list-item">
                                <strong>{edu.degree}</strong> à {edu.institution} ({edu.year})
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="cv-viewer-section">
                    <h3 className="cv-viewer-subheading">Expérience</h3>
                    <ul className="cv-viewer-list">
                        {cvData.experience.map((exp, index) => (
                            <li key={index} className="cv-viewer-list-item">
                                <strong>{exp.jobTitle}</strong> chez {exp.company} ({exp.years} ans)
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
            <footer className="cv-viewer-footer">
                <button className="cv-viewer-button" onClick={() => navigate('/browse-cvs')}>
                    Retour
                </button>
                {cvData.isOwned && (
                    <button className="cv-viewer-button" onClick={() => navigate(`/my-cv`)}>
                        Éditer
                    </button>
                )}
            </footer>
        </div>
    );
};

export default CvViewer;

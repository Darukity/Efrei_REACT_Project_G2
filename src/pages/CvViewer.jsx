import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import "../css/CvViewer.css"; 

const CvViewer = () => {
    const { id } = useParams(); 
    const { user, token } = useContext(AuthContext);

    const navigate = useNavigate(); 
    const [cvData, setCvData] = useState(null);
    const [comments, setComments] = useState([]); 
    const [newComment, setNewComment] = useState(''); 
    const [commentsVisible, setCommentsVisible] = useState(false); 
    const [error, setError] = useState(null);

    // Récupération des données du CV
    useEffect(() => {
        const fetchCv = async () => {
            try {
                const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
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
    }, [id, token]);

    // Récupération des commentaires
    const fetchComments = async () => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/review/cv/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data.recommendations);
        } catch (err) {
            setError(err.message);
        }
    };

    // Ajout d'un commentaire
    const addComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/review/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ cvId: id, userId: user.id, comment: newComment })
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            fetchComments();
            setNewComment(''); 
        } catch (err) {
            setError(err.message);
        }
    };

    // Modification d'un commentaire
    const editComment = async (commentId, newContent) => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/review/${commentId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ comment: newContent })
            });
            if (!response.ok) {
                throw new Error('Not authorized to edit this comment');
            }
            fetchComments();
        } catch (err) {
            alert(err.message);
        }
    };

    // Suppression d'un commentaire
    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/review/${commentId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Pas autorisé');
            }
            fetchComments();
        } catch (err) {
            alert(err.message);
        }
    };

    // Gestion de l'affichage des commentaires
    const toggleComments = async () => {
        if (!commentsVisible) {
            await fetchComments(); 
        }
        setCommentsVisible(!commentsVisible);
    };

    // Affichage des erreurs
    if (error) {
        if (error === 'Unauthorized to see this CV') {
            navigate('/login');
            return null;
        }
        return <div className="cv-viewer-error">{error}</div>;
    }

    // Affichage du chargement
    if (!cvData) {
        return <div className="cv-viewer-loading">Chargement...</div>;
    }

    // Rendu principal
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

                {/* Section des expériences */}
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
                
                {/* Section de l'éducation */}
                {cvData.education && cvData.education.length > 0 && (
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
                )}

                {/* Section des commentaires */}
                <section className="cv-viewer-section">
                    <button className="cv-viewer-button" onClick={toggleComments}>
                        {commentsVisible ? 'Masquer les commentaires' : 'Afficher les commentaires'}
                    </button>

                    {commentsVisible && (
                        <div className="cv-viewer-comments">
                            <h3>Commentaires</h3>
                            <ul className="cv-viewer-comments-list">
                                {comments.map((comment) => (
                                    <li key={comment._id} className="cv-viewer-comment">
                                        <p><strong>{comment.userId.name}:</strong> {comment.comment}</p>
                                        {comment.userId._id === user.id && (
                                            <button onClick={() => editComment(comment._id, prompt('Modifier le commentaire', comment.comment))}>
                                                Modifier
                                            </button>
                                        )}
                                        {(comment.userId._id === user.id || cvData.userId === user.id) && (
                                            <button onClick={() => deleteComment(comment._id)}>Supprimer</button>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {/* Ajouter un commentaire */}
                            <div className="cv-viewer-add-comment">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Ajouter un commentaire"
                                />
                                <button onClick={addComment}>Ajouter</button>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Boutons footer */}
            <footer className="cv-viewer-footer">
                <button className="cv-viewer-button" onClick={() => navigate('/browse-cvs')}>
                    Retour
                </button>
                {cvData.userId === user.id && (
                    <button className="cv-viewer-button" onClick={() => navigate(`/my-cv`)}>
                        Éditer
                    </button>
                )}
            </footer>
        </div>
    );
};

export default CvViewer;

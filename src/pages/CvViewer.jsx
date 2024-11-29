import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import "../css/CvViewer.css"; // Importer le fichier CSS spécifique

const CvViewer = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const { user, token } = useContext(AuthContext); // Authentification et Token
    const navigate = useNavigate(); // Pour rediriger
    const [cvData, setCvData] = useState(null);
    const [comments, setComments] = useState([]); // État pour les commentaires
    const [newComment, setNewComment] = useState(''); // État pour un nouveau commentaire
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

    // Récupération des commentaires du CV
    useEffect(() => {
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
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch comments: ${errorData.message || 'Unknown error'}`);
                }

                const data = await response.json();
                setComments(data || []); // Assurez-vous que la réponse contient les commentaires
            } catch (err) {
                setError(err.message);
            }
        };

        fetchComments();
    }, [id, token]);

    // Ajouter un nouveau commentaire
    const addComment = async () => {
        if (!newComment.trim()) return; // Empêche l'envoi d'un commentaire vide
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/review/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    cvId: id,
                    userId: user.id,
                    comment: newComment
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const createdComment = await response.json();
            setComments([...comments, createdComment]); // Ajoute le commentaire localement
            setNewComment(''); // Réinitialise le champ
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        if (error === 'Unauthorized to see this CV') {
            navigate('/login'); // Redirige vers la page de login si accès interdit
            return null;
        }
        return <div className="cv-viewer-error">{error}</div>;
    }

    if (!cvData) {
        return <div className="cv-viewer-loading">Chargement...</div>;
    }

    return (
        <div className="cv-viewer-container">
            <header className="cv-viewer-header">
                <h1>Visualisation du CV</h1>
            </header>
            <main className="cv-viewer-content">
                {/* Informations du CV */}
                <section className="cv-viewer-section">
                    <h2 className="cv-viewer-name">
                        {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                    </h2>
                    <p className="cv-viewer-description">{cvData.personalInfo.description}</p>
                </section>

                {/* Section des commentaires */}
                <section className="cv-viewer-comments">
                    <h3>Commentaires</h3>
                    <ul className="cv-viewer-comments-list">
                        {comments.map((comment) => (
                            <li key={comment.id} className="cv-viewer-comment">
                                <p><strong>{comment.user.name}:</strong> {comment.comment}</p>
                                {/* Affichage des boutons de gestion pour l'utilisateur connecté */}
                                {(comment.user.id === user.id || cvData.userId === user.id) && (
                                    <>
                                        <button onClick={() => {
                                            const updatedComment = prompt('Modifier le commentaire', comment.comment);
                                            if (updatedComment) {
                                                editComment(comment.id, updatedComment);
                                            }
                                        }}>
                                            Modifier
                                        </button>
                                        <button onClick={() => deleteComment(comment.id)}>
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Ajouter un commentaire */}
                    <div className="cv-viewer-add-comment">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ajoutez un commentaire..."
                        />
                        <button onClick={addComment}>Envoyer</button>
                    </div>
                </section>
            </main>
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

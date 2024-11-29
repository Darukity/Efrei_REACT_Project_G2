import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import "../css/CvViewer.css"; // Importer le fichier CSS spécifique

const CvViewer = () => {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const { user, updateUser, token } = useContext(AuthContext);

    const navigate = useNavigate(); // Pour rediriger
    const [cvData, setCvData] = useState(null);
    const [comments, setComments] = useState([]); // État pour les commentaires
    const [newComment, setNewComment] = useState(''); // État pour un nouveau commentaire
    const [commentsVisible, setCommentsVisible] = useState(false); // État pour afficher/masquer les commentaires
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
    }, [id]);

    // Récupération des commentaires du CV
    const fetchComments = async () => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${id}/comments`, {
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
            setComments(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Ajouter un nouveau commentaire
    const addComment = async () => {
        if (!newComment.trim()) return; // Empêche l'envoi d'un commentaire vide
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${id}/comments`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ comment: newComment })
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

    // Modifier un commentaire
    const editComment = async (commentId, newContent) => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${id}/comments/${commentId}`, {
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
            setComments(
                comments.map((c) =>
                    c.id === commentId ? { ...c, comment: newContent } : c
                )
            );
        } catch (err) {
            alert(err.message);
        }
    };

    // Supprimer un commentaire
    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`https://efrei-api-rest-project-g2.onrender.com/api/cv/${id}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Not authorized to delete this comment');
            }
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (err) {
            alert(err.message);
        }
    };

    // Gestion de l'affichage/masquage des commentaires
    const toggleComments = async () => {
        if (!commentsVisible) {
            await fetchComments(); // Récupère les commentaires seulement si non déjà visibles
        }
        setCommentsVisible(!commentsVisible);
    };

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
                <section className="cv-viewer-section">
                    <button className="cv-viewer-button" onClick={toggleComments}>
                        {commentsVisible ? 'Masquer les commentaires' : 'Afficher les commentaires'}
                    </button>

                    {commentsVisible && (
                        <div className="cv-viewer-comments">
                            <h3>Commentaires</h3>
                            <ul className="cv-viewer-comments-list">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="cv-viewer-comment">
                                        <p><strong>{comment.user.name}:</strong> {comment.comment}</p>
                                        {/* Boutons de gestion */}
                                        {comment.user.id === user.id && (
                                            <button onClick={() => editComment(comment.id, prompt('Modifier le commentaire', comment.comment))}>
                                                Modifier
                                            </button>
                                        )}
                                        {(comment.user.id === user.id || cvData.ownerId === user.id) && (
                                            <button onClick={() => deleteComment(comment.id)}>Supprimer</button>
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
                        </div>
                    )}
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

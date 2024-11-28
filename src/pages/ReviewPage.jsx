import React, { useState, useEffect } from 'react';
import Review from './Review'; // Import du composant Review
import '../css/ReviewPage.css'; // Fichier CSS pour le style

function ReviewPage() {
    const [comments, setComments] = useState([]); // Liste des commentaires
    const [selectedComment, setSelectedComment] = useState(null); // Commentaire sélectionné pour modification
    const [newCommentText, setNewCommentText] = useState(''); // Texte pour ajouter un commentaire
    const [isEditing, setIsEditing] = useState(false); // Indique si on est en mode modification

    // Charger les commentaires au démarrage
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch('https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/comments');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des commentaires.');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Erreur lors du chargement des commentaires :', error);
            }
        };

        fetchComments();
    }, []);

    // Ajouter un nouveau commentaire
    const handleAddComment = async () => {
        if (!newCommentText.trim()) return;

        try {
            const response = await fetch('https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newCommentText }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l’ajout du commentaire.');
            }

            const newComment = await response.json();
            setComments([...comments, newComment]);
            setNewCommentText(''); // Réinitialiser le champ
        } catch (error) {
            console.error('Erreur lors de l’ajout du commentaire :', error);
        }
    };

    // Supprimer un commentaire
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du commentaire.');
            }

            setComments(comments.filter((comment) => comment.id !== commentId)); // Mise à jour de la liste
        } catch (error) {
            console.error('Erreur lors de la suppression du commentaire :', error);
        }
    };

    // Modifier un commentaire
    const handleEditComment = async () => {
        if (!selectedComment || !newCommentText.trim()) return;

        try {
            const response = await fetch(`https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/comments/${selectedComment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newCommentText }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la modification du commentaire.');
            }

            const updatedComment = await response.json();
            setComments(
                comments.map((comment) =>
                    comment.id === updatedComment.id ? updatedComment : comment
                )
            );
            setSelectedComment(null);
            setNewCommentText('');
            setIsEditing(false);
        } catch (error) {
            console.error('Erreur lors de la modification du commentaire :', error);
        }
    };

    // Préparer la modification d'un commentaire
    const startEditing = (comment) => {
        setSelectedComment(comment);
        setNewCommentText(comment.text);
        setIsEditing(true);
    };

    return (
        <div className="review-page">
            <h1>Gestion des Commentaires</h1>

            {/* Formulaire d'ajout ou de modification */}
            <div className="comment-form">
                <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder={isEditing ? 'Modifier le commentaire...' : 'Ajouter un nouveau commentaire...'}
                ></textarea>
                <button onClick={isEditing ? handleEditComment : handleAddComment}>
                    {isEditing ? 'Modifier' : 'Ajouter'}
                </button>
                {isEditing && (
                    <button onClick={() => {
                        setIsEditing(false);
                        setSelectedComment(null);
                        setNewCommentText('');
                    }}>
                        Annuler
                    </button>
                )}
            </div>

            {/* Liste des commentaires */}
            <ul className="comments-list">
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <Review
                            comment={comment}
                            onDelete={() => handleDeleteComment(comment.id)}
                            onEdit={() => startEditing(comment)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ReviewPage;

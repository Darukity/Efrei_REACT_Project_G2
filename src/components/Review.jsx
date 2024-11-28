import React from 'react';
import '../css/Review.css'; // Fichier CSS pour le style

function Review({ comment, onDelete, onEdit }) {
    return (
        <div className="review-item">
            <p>{comment.text}</p>
            <div className="review-actions">
                <button onClick={onEdit} className="btn-edit">Modifier</button>
                <button onClick={onDelete} className="btn-delete">Supprimer</button>
            </div>
        </div>
    );
}

export default Review;
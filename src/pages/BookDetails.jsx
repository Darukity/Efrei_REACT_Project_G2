import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/books/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container-fluid">
            <p>{book.label}</p>
            <p>{book.description}</p>
        </div>
    );
}

export default BookDetails;

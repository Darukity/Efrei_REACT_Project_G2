import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookContext } from '../context/BookContext.jsx';

function Home() {
    const { updateFavoriteBook } = useContext(BookContext);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/books');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        };

        fetchData();
    }, []);

    const handleClick = (event) => {
        updateFavoriteBook(event.target.id);
    };

    return (
        <div>
            <h1>Accueil</h1>
            <p>test</p>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        <Link to={`/books/${book._id}`} id={book.label} onClick={handleClick}>
                            {book.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;

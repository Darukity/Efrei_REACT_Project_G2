import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen.jsx';

function Users() {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (users) {
            setIsLoading(true);
        }
    }, [users]);

    if (!isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <ul className="container-fluid vh-100">
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/user/${user.id}`}>{user.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Users;

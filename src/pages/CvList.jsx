import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext.jsx';
import "../css/CvList.css";

const CvList = () => {
    const { token } = useContext(AuthContext);

    const [cvList, setCvList] = useState([]);
    const [filteredCvList, setFilteredCvList] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCvs = async () => {
            try {
                const response = await fetch(
                    "https://efrei-api-rest-project-g2.onrender.com/api/cv/getAllVisible",
                    {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch CVs");
                }
                const data = await response.json();
                setCvList(data); 
                setFilteredCvList(data); 
            } catch (error) {
                console.error("Error fetching CVs:", error);
            }
        };

        fetchCvs();
    }, [token]);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = cvList.filter(cv => {
            const { firstName, lastName, description } = cv.personalInfo;
            return (
                firstName.toLowerCase().includes(term) ||
                lastName.toLowerCase().includes(term) ||
                (description && description.toLowerCase().includes(term))
            );
        });

        setFilteredCvList(filtered);
    };

    const handleCvClick = (cv_id) => {
        navigate(`/CvViewer/${cv_id}`);
    };

    return (
        <div className="cvlist-container">
            {/* Barre de recherche */}
            <input
                type="text"
                className="cvlist-search"
                placeholder="Rechercher un CV par prénom, nom ou description... 1 seul terme"
                value={searchTerm}
                onChange={handleSearch}
            />

            {/* Liste des CVs */}
            <div className="cvlist">
                {filteredCvList.map((cv) => (
                    <div
                        key={cv._id}
                        className="cvlist-card"
                        onClick={() => handleCvClick(cv._id)}
                    >
                        <img
                            src="https://icones.pro/wp-content/uploads/2021/06/icone-fichier-document-noir.png"
                            alt="Document"
                            className="cvlist-icon"
                        />
                        <div className="cvlist-name">
                            {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CvList;

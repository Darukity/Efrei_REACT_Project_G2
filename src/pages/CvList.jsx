import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext.jsx';
import "../css/CvList.css"; // Importer le fichier CSS spÃ©cifique

const CvList = () => {
    const { user, updateUser , token} = useContext(AuthContext);

    const [cvList, setCvList] = useState([]);
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
                setCvList(data); // Assuming the API returns an array of CVs
            } catch (error) {
                console.error("Error fetching CVs:", error);
            }
        };

        fetchCvs();
    }, []);

    const handleCvClick = (cv_id) => {
        navigate(`/CvViewer/${cv_id}`);
    };

    return (
        <div className="cvlist-container">
            {cvList.map((cv) => (
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
    );
};

export default CvList;
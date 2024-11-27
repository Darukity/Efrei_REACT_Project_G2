import React from 'react';
import '../css/HomePage.css'; // Import du fichier CSS

function Home() {
    return (
        <div className="home-container">
            {/* Section Hero */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Bienvenue sur le Générateur de CV</h1>
                    <p>
                        Une plateforme intuitive pour créer, partager, et gérer vos CV en toute simplicité.
                        Idéal pour mettre en valeur vos compétences et décrocher l'emploi de vos rêves !
                    </p>
                    <a href="#features" className="cta-button">
                        Découvrir les fonctionnalités
                    </a>
                </div>
                <div className="hero-image">
                    <img 
                        src="https://www.jobenstock.fr/blog/wp-content/uploads/2017/12/Exemple-de-CV-Istock.jpg" 
                        alt="Illustration de création de CV" 
                    />
                </div>
            </section>

            {/* Section Fonctionnalités */}
            <section id="features" className="features-section">
                <h2>Fonctionnalités du Générateur de CV</h2>
                <div className="features-grid">
                    <div className="feature">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKkZyRTpO1yTNiNZG5VHT3A4ErwHb3l_pEHA&s/150" alt="Inscription" />
                        <h3>Inscription et gestion de compte</h3>
                        <p>
                            Créez un compte pour sauvegarder vos informations et accéder à toutes les
                            fonctionnalités.
                        </p>
                    </div>
                    <div className="feature">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuIRMv7naZOR7bwhm1CBb5GIBK1ftUcjQaGw&s/150" alt="Création de CV" />
                        <h3>Création de CV</h3>
                        <p>
                            Générez un CV professionnel en quelques clics grâce à nos modèles intuitifs.
                        </p>
                    </div>
                    <div className="feature">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtw62yE6ME3b7wJqAtKAWPA6S7i5f83gNU8c25uh6F1LqxJuaO9d1J_1FwQcGdIRGdL7w&usqp=CAU/150" alt="Visibilité" />
                        <h3>Contrôle de visibilité</h3>
                        <p>
                            Choisissez qui peut voir votre CV pour préserver votre confidentialité.
                        </p>
                    </div>
                    <div className="feature">
                        <img src="https://cdn-icons-png.flaticon.com/512/992/992846.png" alt="Recommandations" />
                        <h3>Recommandations</h3>
                        <p>
                            Laissez des recommandations ou recevez-en pour enrichir vos candidatures.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section Projet de Fin d'Études */}
            <section className="about-section">
                <h2>Un projet créé par des étudiants</h2>
                <p>
                    Ce site a été développé dans le cadre d'un projet de fin d'études par une équipe
                    passionnée d'étudiants. Nous avons voulu créer un outil utile pour les chercheurs
                    d'emploi tout en mettant en pratique nos compétences en développement web.
                </p>
                <p>
                    Merci de visiter notre site, et nous espérons qu'il vous sera utile !
                </p>
            </section>
        </div>
    );
}

export default Home;

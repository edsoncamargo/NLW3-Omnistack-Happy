import React from 'react';

import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

import '../styles/pages/landing-page.css';
import logoImage from '../asset/images/Logo.svg';

function LandingPage() {
    return (
        <div id="landing-page">
            <div className="content-wrapper">
                <img src={logoImage} alt="Application Happy logo." />
                <main>
                    <h1>
                        Leve felicidade para o mundo
                    </h1>
                    <p>
                        Visite orfanatos e mude o dia
                        de muitas crianças.
                    </p>
                    <div className="location">
                        <strong>São Paulo</strong>
                        <span>São Paulo</span>
                    </div>

                    <Link to="/orphanages-map" className="enter-app">
                        <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default LandingPage;
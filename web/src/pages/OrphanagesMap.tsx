import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/pages/orphanages-map.css';
import localImage from '../asset/images/Local.svg';
import happyMapIcon from '../utils/MapIcon';
import api from '../services/api';

interface Orphanage {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect(() => {
        api.get('/api/v1/orphanages').then((response) => {
            setOrphanages(response.data);
            console.log(orphanages);
        });
    }, []);

    return (
        <div id="orphanages-map">
            <aside className="sidebar">
                <header>
                    <img className="logo-sidebar" src={localImage} alt="Marker" />
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita 😄</p>
                </header>

                <footer>
                    <strong>São Paulo</strong>
                    <span>São Paulo</span>
                </footer>
            </aside>

            <Map
                center={[-23.7429479, -46.694787]}
                zoom={19.25}
                style={{ width: '100%', height: '100%' }}>
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer>

                {orphanages.map(orphanage => {
                    return (
                        <Marker
                            key={orphanage.id}
                            position={[orphanage.latitude, orphanage.longitude]}
                            icon={happyMapIcon}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="marker-popup">
                                {orphanage.name}
                                <Link className="popup-button" to={`/orphanage/${orphanage.id}`}>
                                    <FiArrowRight size={20} color={"#fff"} />
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanage/create" className="create-orphanage-button">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    )
}

export default OrphanagesMap;
import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom';
import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import happyMapIcon from "../utils/MapIcon";
import api from "../services/api";

interface Orphanage {
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  openingHours: string;
  openOnWeekends: boolean;
  images: [{
    url: string;
    id: number;
  }]
}

interface OrphanageParams {
  id: string;
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeIndexImage, setActiveIndexImage] = useState<number>(0);

  useEffect(() => {
    api.get(`/api/v1/orphanages/${params.id}`).then((response) => {
      setOrphanage(response.data);
    });
  }, [params.id]);

  if (!orphanage) {
    return <p>Carregando...</p>
  }

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeIndexImage].url} alt="Lar das meninas" />

          <div className="images">
            {orphanage.images.map((image, i) => {
              return (<button
                onClick={() => {
                  setActiveIndexImage(i);
                }}
                key={image.id}
                className={activeIndexImage === i ? 'active' : ''} type="button">
                <img src={image.url} alt={orphanage.name} />
              </button>
              )
            })}
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                />
                <Marker interactive={false} icon={happyMapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>

              <footer>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude}${orphanage.longitude}`} target="_blank" rel="noopener noreferrer">Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à sexta-feira <br />
                {orphanage.openingHours}
              </div>
              {orphanage.openOnWeekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                Atendemos <br />
                fim de semana
                </div>
              ) : (
                  <div className="open-on-weekends dont-open">
                    <FiInfo size={32} color="#FF669D" />
                Não atendemos <br />
                fim de semana
                  </div>
                )}
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
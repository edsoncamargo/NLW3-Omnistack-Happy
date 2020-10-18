import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from "react-icons/fi";
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import happyMapIcon from "../utils/MapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {
  const history = useHistory();

  const [latlng, setLatlng] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {

    const { lat, lng } = event.latlng;
    setLatlng({
      latitude: lat,
      longitude: lng
    });
  }

  async function handleSubmitOrphanage(event: FormEvent) {

    event.preventDefault();
    const { latitude, longitude } = latlng;
    const data = new FormData();
    data.append('latitude', latitude.toString());
    data.append('longitude', longitude.toString());
    data.append('name', name.trim());
    data.append('about', about.trim());
    data.append('instructions', instructions.trim());
    data.append('openingHours', openingHours.trim());
    data.append('openOnWeekends', openOnWeekends.toString());
    images.forEach(image => {
      data.append('images', image);
    })
    await api.post('/api/v1/orphanages', data);
    alert('Cadastro realizados com sucesso 😄');
    history.push('/orphanages-map');
  }

  function handleSelectedImages(event: ChangeEvent<HTMLInputElement>) {

    if (event.target.files === null) {
      return;
    }
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
    const selectedImagesPreview = selectedImages.map(image => URL.createObjectURL(image));
    setPreviewImages(selectedImagesPreview);
  }

  return (<div id="page-create-orphanage">
    <Sidebar />

    <main>
      <form onSubmit={handleSubmitOrphanage} className="create-orphanage-form">
        <fieldset>
          <legend>Dados</legend>

          <Map
            center={[-23.7429479, -46.694787]}
            style={{ width: '100%', height: 280 }}
            zoom={15}
            onclick={handleMapClick}
          >
            <TileLayer
              url={`https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`}
            />

            <Marker interactive={false} icon={happyMapIcon} position={[latlng.latitude, latlng.longitude]} />
          </Map>

          <div className="input-block">
            <label htmlFor="name">Nome</label>
            <input id="name" value={name} onChange={event => setName(event.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
            <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="images">Fotos</label>

            <div className="images-container">
              {previewImages.map(image => {
                return (
                  <img key={image} src={image} alt={name} />
                )
              })}
              <label htmlFor="image[]" className="new-image">
                <FiPlus size={24} color="#15b6d6" />
              </label>
              <input multiple onChange={handleSelectedImages} type="file" id="image[]" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Visitação</legend>

          <div className="input-block">
            <label htmlFor="instructions">Instruções</label>
            <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="opening_hours">Horário de funcionamento</label>
            <input id="opening_hours" value={openingHours} onChange={event => setOpeningHours(event.target.value)} />
          </div>

          <div className="input-block">
            <label htmlFor="open_on_weekends">Atende fim de semana</label>

            <div className="button-select">
              <button type="button" onClick={() => setOpenOnWeekends(true)} className={openOnWeekends === true ? 'active' : ''}>Sim</button>
              <button type="button" onClick={() => setOpenOnWeekends(false)} className={openOnWeekends === false ? 'active' : ''}>Não</button>
            </div>
          </div>
        </fieldset>

        <button className="confirm-button" type="submit">
          Confirmar
          </button>
      </form>
    </main>
  </div>);
}

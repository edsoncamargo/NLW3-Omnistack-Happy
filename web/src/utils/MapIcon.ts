import Leaflet from 'leaflet';
import mapLocalMarkerImage from '../asset/images/Local.svg'

const happyMapIcon = Leaflet.icon({
    iconUrl: mapLocalMarkerImage,
    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [0, -60]
});

export default happyMapIcon;
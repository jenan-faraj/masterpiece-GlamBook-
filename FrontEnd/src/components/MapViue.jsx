import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ location }) => {
  if (!location) return <p>جارٍ تحميل الخريطة...</p>;

  const position = [location.lat, location.lng];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>📍 الموقع هنا!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;

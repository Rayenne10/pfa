import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getHotelById } from "../api/hotel.api";
import { getRoomsByHotel } from "../api/room.api";

import {
  MapPin,
  Bed,
  Users,
  DollarSign,
  ArrowLeft
} from "lucide-react";


export default function AdminHotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchHotel();
      fetchRooms();
    }
  }, [id]);

  const fetchHotel = async () => {
    const data = await getHotelById(Number(id));
    setHotel(data);
  };

  const fetchRooms = async () => {
    const res = await getRoomsByHotel(Number(id));
    setRooms(res.data);
  };

  if (!hotel) return <p style={{ color: "white" }}>Chargement...</p>;

  return (
    <div className="landing-page hotels-page">

      {/* BOUTON RETOUR */}
      <button
        className="btn-secondary"
        style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}
        onClick={() => navigate("/hotels")} // ou navigate(-1) pour revenir à la page précédente
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      {/* HOTEL INFO */}
      <h1 className="about-header">{hotel.name}</h1>

      <div className="hotel-card">
        <div className="hotel-info">
          <p className="hotel-location">
            <MapPin className="location-icon" />
            {hotel.address}
          </p>

          <p className="hotel-description">
            {hotel.description}
          </p>
          {/* SEE AVAILABLE ROOMS BUTTON */}
    <button
      className="btn-primary"
      style={{ marginTop: "15px", width: "fit-content" }}
      onClick={() => navigate(`/hotels/${hotel.id}/available-rooms`)}
    >
      Voir les chambres disponibles
    </button>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        width: "100%",
        marginTop: "40px",
        marginBottom: "20px" 
      }}>
        <h2 className="about-header" style={{ margin: 0 }}>Chambres</h2>

      </div>

      {/* ROOMS LIST */}
      <div className="hotels-list">
        {rooms.map((room) => (
          <div className="hotel-card" key={room.id}>
            <div className="hotel-info">
  <h3 className="hotel-name">Chambre {room.roomNumber}</h3>

  <div className="info-row">
    <Bed className="icon" />
    {room.type}

    <Users className="icon" style={{ marginLeft: "10px" }} />
    {room.capacity}
  </div>

  <div className="info-row">
    <DollarSign className="icon" />
    {room.price} TND
  </div>

  {/* DESCRIPTION */}
  {room.description && (
    <p className="room-description" style={{ marginTop: "8px", color: "white" }}>
      {room.description}
    </p>
  )}

  {/* FEATURES */}
  {room.features && room.features.length > 0 && (
    <div className="room-features" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
      {room.features.map((feature: string) => (
        <span
          key={feature}
          style={{
            background: "rgba(255,255,255,0.12)",
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            color: "white"
          }}
        >
          {feature}
        </span>
      ))}
    </div>
  )}
</div>

            <div className="hotel-actions-icons">
</div>
          </div>
        ))}
      </div>
    </div>
  );
}
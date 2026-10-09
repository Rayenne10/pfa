import { useEffect, useState } from "react";
import {
  getAllHotels,
  deleteHotel,
} from "../../../api/hotel.api";
import "../../../styles/AdminHotels.css";
import { hotelImages } from "../../../assets/hotels";
import { MapPin, Pencil, Trash2, ArrowLeft, CalendarCheck, DoorOpen } from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchHotels = async () => {
    const data = await getAllHotels();
    setHotels(data);
  };
  
  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteHotel(id);
    toast.success("Supprimé");
    fetchHotels();
  };

  const getImage = (id: number) => {
    return hotelImages[id % hotelImages.length];
  };

  return (
    <div className="landing-page hotels-page">

      {/* BOUTON RETOUR */}
      <button
        className="btn-secondary"
        style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}
        onClick={() => navigate("/admin/dashboard")} // ou navigate(-1) pour revenir à la page précédente
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <h1 className="about-header">Gestion des hôtels</h1>

      <button
        className="btn-primary"
        onClick={() => navigate("/admin/create-hotel")}
        style={{ marginBottom: "20px" }}
      >
        + Ajouter un hôtel
      </button>

      <div className="hotels-list">

        {hotels.map((hotel) => (
          <div className="hotel-card" key={hotel.id}>

            <img
              src={getImage(hotel.id)}
              className="hotel-image"
              alt={hotel.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/250x150";
              }}
            />

            <div className="hotel-info">

              <h3 className="hotel-name">{hotel.name}</h3>

              <p className="hotel-location">
                <MapPin className="location-icon" />
                {hotel.address}
              </p>

              <p className="hotel-description">
                {hotel.description}
              </p>

            </div>

            <div className="hotel-actions-icons">
              {/* Voir chambres */}
              <button
                className="btn-icon btn-primary-icon"
                onClick={() => navigate(`/admin/hotels/${hotel.id}/rooms`)}
              >
                <DoorOpen size={18} />
              </button>

              {/* Voir réservations */}
              <button
                className="btn-icon btn-primary-icon"
                onClick={() => navigate(`/admin/hotels/${hotel.id}/reservations`)}
              >
                <CalendarCheck size={18} />
              </button>
              
              <button 
                className="btn-icon btn-secondary" 
                onClick={() => navigate(`/admin/update-hotel/${hotel.id}`)}
              >
                <Pencil size={18} />
              </button>
              
              <button 
                className="btn-icon btn-delete" 
                onClick={() => handleDelete(hotel.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
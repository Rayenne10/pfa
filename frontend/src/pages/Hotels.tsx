import React, { useEffect, useState } from "react";
import { getAllHotels } from "../api/hotel.api";
import { hotelImages } from "../assets/hotels";
import { MapPin } from "lucide-react"; // <-- Import Lucide icon
import "../styles/HotelsPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface Hotel {
  id: number;
  name: string;
  address: string;
  description: string;
  imageUrl?: string;
}

const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        const hotelsWithImages = data.map((hotel, index) => ({
          ...hotel,
          imageUrl: hotelImages[index % hotelImages.length],
        }));
        setHotels(hotelsWithImages);
      } catch {
        setError("Impossible de charger les hôtels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="landing-page hotels-page">
        <Navbar />
      <h2 className="about-header">Nos Hôtels</h2>
      <div className="hotels-list">
        {hotels.map((hotel) => (
          <div className="hotel-card" key={hotel.id}>
            <img src={hotel.imageUrl} alt={hotel.name} className="hotel-image" />
            <div className="hotel-info">
              <h3 className="hotel-name">{hotel.name}</h3>
              <p className="hotel-location">
                <MapPin size={16} className="location-icon" /> {/* <-- Lucide icon */}
                {hotel.address}
              </p>
              <p className="hotel-description">{hotel.description}</p>
            </div>
            <div className="hotel-buttons">
              <button onClick={() => navigate(`/hotels/${hotel.id}`)} className="btn-secondary">Voir nos offres</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelsPage;
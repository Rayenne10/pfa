import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import { hotelImages } from "../assets/hotels";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % hotelImages.length);
    }, 5000); // change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title title-gradient title-animate">
          Explorez le monde avec <span className="highlight">Velora Hotels</span>
        </h1>
        <p className="hero-subtitle">
          Trouvez des hôtels d'exception et planifiez votre prochaine escapade
         en quelques clics.
        </p>
        <div className="hero-buttons">
          <button onClick={() => navigate("/hotels")} className="btn-primary">Réserver maintenant</button>
        </div>
      </div>

      <div className="hero-image">
        {hotelImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Voyage ${index + 1}`}
            className={`carousel-image ${index === current ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
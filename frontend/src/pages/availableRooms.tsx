import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAvailableRooms } from "../api/room.api";
import { createReservation } from "../api/reservation.api";
import { getMe } from "../api/auth.api";// fonction pour récupérer user connecté

import {
  Bed,
  Users,
  DollarSign,
  ArrowLeft
} from "lucide-react";

export default function AvailableRooms() {
  const { id } = useParams(); // hotel id
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  // 🔹 Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const fetchAvailableRooms = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const res = await getAvailableRooms(id!, startDate, endDate);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserveClick = (room: any) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleConfirmReservation = async () => {
    if (!user || !selectedRoom) return;
    try {
      await createReservation({
        userId: user.id,
        hotelId: Number(id),
        roomId: selectedRoom.id,
        startDate,
        endDate,
      });
      setShowModal(false);
      navigate("/reservations"); // redirection après confirmation
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing-page hotels-page">
      <button
        className="btn-secondary"
        style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}
        onClick={() => navigate("/hotels")}
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <h1 className="about-header">Chambres disponibles</h1>

      {/* FORMULAIRE DATES */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
        <button className="btn-primary" onClick={fetchAvailableRooms}>
          Afficher chambres disponibles
        </button>
      </div>

      {/* LISTE DES CHAMBRES */}
      {loading && <p style={{ color: "white" }}>Chargement...</p>}
      {!loading && startDate && endDate && rooms.length === 0 && (
  <p style={{ color: "white" }}>
    Aucune chambre disponible pour les dates sélectionnées.
  </p>
)}
      <div className="hotels-list">

        {rooms.map((room) => (
          <div className="hotel-card" key={room.id}>
            <div className="hotel-info">
              <h3 className="hotel-name">Chambre {room.roomNumber}</h3>
              <div className="info-row">
                <Bed className="icon" /> {room.type}
                <Users className="icon" style={{ marginLeft: "10px" }} /> {room.capacity}
              </div>
              <div className="info-row">
                <DollarSign className="icon" /> {room.price} TND
              </div>
              {room.description && <p className="room-description">{room.description}</p>}
              {room.features && room.features.length > 0 && (
                <div className="room-features" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {room.features.map((feature: string) => (
                    <span key={feature} style={{ background: "rgba(255,255,255,0.12)", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", color: "white" }}>
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="hotel-actions-icons">
  <button
    className="btn-secondary"
    onClick={() => {
      const token = localStorage.getItem("token"); // ou check user
      if (!token) {
        navigate("/login"); // redirige vers la page login
      } else {
        handleReserveClick(room); // si connecté, continue
      }
    }}
  >
    Réserver
  </button>
</div>
          </div>
        ))}
      </div>

      {/* MODAL DE CONFIRMATION */}
      {showModal && selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmer la réservation</h2>
            <p><strong>Chambre:</strong> {selectedRoom.roomNumber} ({selectedRoom.type})</p>
            <p><strong>Capacité:</strong> {selectedRoom.capacity}</p>
            <p><strong>Prix/Nuitée:</strong> {selectedRoom.price} TND</p>
            <p><strong>Date de début:</strong> {startDate}</p>
            <p><strong>Date de fin:</strong> {endDate}</p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-primary" onClick={handleConfirmReservation}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .modal-content {
            background: #1e1e2f;
            padding: 20px 30px;
            border-radius: 12px;
            color: white;
            width: 100%;
            max-width: 400px;
          }
        `}
      </style>
    </div>
  );
}
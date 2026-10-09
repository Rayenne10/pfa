import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservationsByRoom, cancelReservation } from "../../../api/reservation.api";
import { getRoomById } from "../../../api/room.api";
import { getHotelById } from "../../../api/hotel.api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function AdminRoomReservations() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [archive, setArchive] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!hotelId || !roomId) return;

        const h = await getHotelById(Number(hotelId));
        setHotel(h);

        const r = await getRoomById(Number(roomId));
        setRoom(r.data);

        const reservations = await getReservationsByRoom(Number(roomId));

        const today = new Date();

        setUpcoming(
          reservations
            .filter((res: any) => new Date(res.startDate) >= today)
            .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        );

        setArchive(
          reservations
            .filter((res: any) => new Date(res.endDate) < today)
            .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [hotelId, roomId]);

  const handleCancel = async () => {
    try {
      await cancelReservation(selectedReservation.id);
      toast.success("Réservation annulée !");
      setModalOpen(false);
      setSelectedReservation(null);
      // refresh
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'annulation.");
    }
  };

  if (loading) return <p style={{ color: "white" }}>Chargement...</p>;
  if (!hotel || !room) return <p style={{ color: "white" }}>Hôtel ou chambre non trouvé(e).</p>;

  const renderReservationCard = (resv: any) => {
    const today = new Date();
    const isUpcoming = new Date(resv.startDate) >= today;
    const canCancel = isUpcoming && resv.status !== "cancelled";

    return (
      <div key={resv.id} className="hotel-card">
        <h3 className="hotel-name">Réservation</h3>
        <p><strong>Utilisateur ID:</strong> {resv.userId}</p>
        <p><strong>Prix total:</strong> {resv.totalPrice} TND</p>
        <p>
          <strong>Dates:</strong> {format(new Date(resv.startDate), "dd/MM/yyyy")} - {format(new Date(resv.endDate), "dd/MM/yyyy")}
        </p>
        <p><strong>Status:</strong> {resv.status}</p>

        {canCancel && (
          <button
            className="btn-delete"
            onClick={() => {
              setSelectedReservation(resv);
              setModalOpen(true);
            }}
          >
            Annuler
          </button>
        )}
      </div>
    );
  };

  const ModalComponent = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#1f1f1f", padding: "30px", borderRadius: "16px",
        maxWidth: "500px", width: "90%", color: "white", boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        position: "relative"
      }}>
        {children}
        <button
          style={{ position: "absolute", top: "10px", right: "10px", background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: "white" }}
          onClick={onClose}>×</button>
      </div>
    </div>
  );

  return (
    <div className="landing-page hotels-page">
      <button
        className="btn-secondary"
        style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}
        onClick={() => navigate(-1)} // ou navigate(-1) pour revenir à la page précédente
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <h1 className="about-header">{hotel.name} - Chambre {room.roomNumber} - Réservations</h1>

      <h2 className="about-header" style={{ marginTop: "20px", textAlign: "left" }}>À venir</h2>
      {upcoming.length === 0 && <p style={{ color: "white" }}>Aucune réservation à venir.</p>}
      <div className="hotels-list">{upcoming.map(renderReservationCard)}</div>

      <h2 className="about-header" style={{ marginTop: "40px", textAlign: "left" }}>Archives</h2>
      {archive.length === 0 && <p style={{ color: "white" }}>Aucune réservation passée.</p>}
      <div className="hotels-list">{archive.map(renderReservationCard)}</div>

      {modalOpen && selectedReservation && (
        <ModalComponent onClose={() => setModalOpen(false)}>
          <h3>Confirmer l'annulation</h3>
          <p>Voulez-vous vraiment annuler cette réservation ?</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={handleCancel}>Confirmer</button>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
          </div>
        </ModalComponent>
      )}
    </div>
  );
}
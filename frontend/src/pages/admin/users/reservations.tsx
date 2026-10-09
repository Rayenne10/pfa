import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReservationsByUser, cancelReservation } from "../../../api/reservation.api";
import { getHotelById } from "../../../api/hotel.api";
import { getRoomsByHotel } from "../../../api/room.api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function AdminUserReservations() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [archive, setArchive] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!userId) return;

        const reservations = await getReservationsByUser(Number(userId));

        // 🔹 enrichir avec hôtel + chambre
        const detailedReservations = await Promise.all(
          reservations.map(async (resv: any) => {
            const hotel = await getHotelById(resv.hotelId);
            const rooms = await getRoomsByHotel(resv.hotelId);
            const room = rooms.data.find((r: any) => r.id === resv.roomId);

            return { ...resv, hotel, room };
          })
        );

        const today = new Date();

        setUpcoming(
          detailedReservations
            .filter((r) => new Date(r.startDate) >= today)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        );

        setArchive(
          detailedReservations
            .filter((r) => new Date(r.endDate) < today)
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        );

      } catch (err) {
        console.error(err);
        toast.error("Erreur chargement réservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleCancel = async () => {
    try {
      await cancelReservation(selectedReservation.id);
      toast.success("Réservation annulée !");
      window.location.reload();
      setModalOpen(false);
      setSelectedReservation(null);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'annulation.");
    }
  };

  if (loading) return <p style={{ color: "white" }}>Chargement...</p>;

  const renderReservationCard = (resv: any) => {
    const today = new Date();
    const isUpcoming = new Date(resv.startDate) >= today;
    const canCancel = isUpcoming && resv.status !== "cancelled";

    return (
      <div key={resv.id} className="hotel-card">
        <h3 className="hotel-name">
          {resv.hotel.name} - Chambre {resv.room?.roomNumber}
        </h3>

        <p>
          <strong>Type:</strong> {resv.room?.type},{" "}
          <strong>Capacité:</strong> {resv.room?.capacity} pers
        </p>

        <p><strong>Prix:</strong> {resv.totalPrice} TND</p>

        <p>
          <strong>Dates:</strong>{" "}
          {format(new Date(resv.startDate), "dd/MM/yyyy")} -{" "}
          {format(new Date(resv.endDate), "dd/MM/yyyy")}
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

  // 🔹 Modal
  const ModalComponent = ({ onClose, children }: any) => (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#1f1f1f",
        padding: "30px",
        borderRadius: "16px",
        maxWidth: "500px",
        width: "90%",
        color: "white",
        position: "relative"
      }}>
        {children}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "18px"
          }}
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <div className="landing-page hotels-page">

      {/* 🔙 retour */}
      <button
        className="btn-secondary"
        style={{ marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <h1 className="about-header">Réservations utilisateur</h1>

      <h2 className="about-header" style={{ textAlign: "left" }}>À venir</h2>
      {upcoming.length === 0 && <p style={{ color: "white" }}>Aucune réservation à venir.</p>}
      <div className="hotels-list">{upcoming.map(renderReservationCard)}</div>

      <h2 className="about-header" style={{ marginTop: "40px", textAlign: "left" }}>Archives</h2>
      {archive.length === 0 && <p style={{ color: "white" }}>Aucune réservation passée.</p>}
      <div className="hotels-list">{archive.map(renderReservationCard)}</div>

      {modalOpen && selectedReservation && (
        <ModalComponent onClose={() => setModalOpen(false)}>
          <h3>Confirmer l'annulation</h3>
          <p>
            Annuler la réservation chambre {selectedReservation.room?.roomNumber} ?
          </p>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
            <button className="btn-primary" onClick={handleCancel}>
              Confirmer
            </button>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
          </div>
        </ModalComponent>
      )}
    </div>
  );
}
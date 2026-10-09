import { useEffect, useState } from "react";
import { getAllUsers } from "../../../api/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des utilisateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Chargement...</p>;

  return (
    <div className="landing-page hotels-page">

      {/* 🔙 Bouton retour */}
      <button
        className="btn-secondary"
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
        onClick={() => navigate("/admin/dashboard")}
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <h1 className="about-header">Liste des utilisateurs</h1>

      {users.length === 0 ? (
        <p style={{ color: "white" }}>Aucun utilisateur trouvé.</p>
      ) : (
        <div className="hotels-list">
          {users.map(user => (
            <div key={user.id} className="hotel-card">

              <div className="hotel-info">
                <h3 className="hotel-name">
                  {user.firstName} {user.lastName}
                </h3>

                <p className="hotel-description">
                  <strong>Email:</strong> {user.email}
                </p>

                <p className="hotel-description">
                  <strong>Rôle:</strong> {user.role}
                </p>
              </div>

              {/* 🔹 Actions à droite */}
              <div className="hotel-actions-icons">
                <button
                  className="btn-icon btn-primary-icon"
                  onClick={() => navigate(`/admin/users/${user.id}/reservations`)}
                  title="Voir réservations"
                >
                  <Calendar size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
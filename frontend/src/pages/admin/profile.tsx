import { useEffect, useState } from "react";
import { getMe } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";
import { ArrowLeft } from "lucide-react";

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res);
      } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Chargement...</p>;
  if (!user) return <p style={{ color: "white" }}>Utilisateur non connecté.</p>;

  return (
    <div className="landing-page profile-page">

      {/* 🔙 Bouton retour */}
      <button
        className="btn-secondary"
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "left",
          gap: "8px"
        }}
        onClick={() => navigate("/admin/dashboard")}
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <h1 className="profile-header">Mon Profil</h1>

      <div className="profile-container">
        <p><strong>Nom :</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Compte vérifié :</strong> {user.isVerified ? "Oui" : "Non"}</p>

        <button
          className="profile-edit-btn"
          onClick={() => navigate("/admin/profile/edit")}
        >
          Modifier
        </button>
      </div>
    </div>
  );
}
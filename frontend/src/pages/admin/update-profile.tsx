import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateUser } from "../../api/auth.api";
import toast from "react-hot-toast";

export default function AdminEdit() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res);
        setFormData({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          password: "",
        });
      } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.id) throw new Error("Utilisateur non connecté");
      const dataToSend = { ...formData, id: user.id };
      if (formData.password === "") {
        const { password, ...dataWithoutPassword } = dataToSend;
        await updateUser(dataWithoutPassword);
      } else {
        await updateUser(dataToSend);
      }

      toast.success("Profil mis à jour !");
      navigate("/admin/profile"); // redirection vers la page profil
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <p style={{ color: "white" }}>Chargement...</p>;
  if (!user) return <p style={{ color: "white" }}>Utilisateur non connecté.</p>;

  return (
    <div className="landing-page profile-page">

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-form-section">
            <div className="form-box">
              <h2>Modifier mon profil</h2>
              <p className="subtitle">Mettez à jour vos informations ci-dessous.</p>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="firstName">Prénom</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="lastName">Nom</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="password">Nouveau mot de passe</label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Laissez vide pour ne pas changer"
                    />
                  </div>
                </div>

                <button className="btn-primary" type="submit">
                  Enregistrer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
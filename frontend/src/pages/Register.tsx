import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { register } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(
        form.email,
        form.password,
        form.firstName,
        form.lastName
      );

      toast.success("Compte créé avec succès");

      // redirection après 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="title-gradient title-animate" >Créer un compte</h2>
      <p className="subtitle">
        Rejoignez le cercle Velora dès aujourd'hui.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Prénom</label>
          <input
            required
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <label>Nom</label>
          <input
            required
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="toggle-text">
        Déjà membre ? <Link to="/login">Se connecter</Link>
      </p>
    </AuthLayout>
  );
}
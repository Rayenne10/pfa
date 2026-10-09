import { useState } from "react";
import { requestReset } from "../api/auth.api";
import AuthLayout from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RiLockPasswordLine } from "react-icons/ri";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 IMPORTANT

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await requestReset(email);
      const data = res.data.data;

      toast.success("Email de réinitialisation envoyé");

      console.log("RESET TOKEN:", data.reset_token);

      // 🔥 REDIRECTION après succès
      setTimeout(() => {
        navigate("/reset"); 
      }, 1200);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
        <div className="auth-icon">
  <RiLockPasswordLine />
</div>
      <h2 className="title-gradient title-animate">Mot de passe oublié</h2>
      <p className="subtitle">
        Entrez votre email pour recevoir un lien de réinitialisation.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="nom@exemple.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      <p className="toggle-text">
        Retour à la <Link to="/login">connexion</Link>
      </p>
    </AuthLayout>
  );
}
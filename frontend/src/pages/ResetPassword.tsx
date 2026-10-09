import { useState, useEffect } from "react";
import { resetPassword } from "../api/auth.api";
import AuthLayout from "../components/AuthLayout";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RiLockPasswordLine } from "react-icons/ri";
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // récupérer token depuis URL
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) setToken(urlToken);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(token, password);

      toast.success("Mot de passe mis à jour");

      // redirection vers login
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
        <div className="auth-icon">
  <RiLockPasswordLine />
</div>
      <h2 className="title-gradient title-animate">Réinitialiser le mot de passe</h2>
      <p className="subtitle">
        Entrez votre nouveau mot de passe.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Si pas de token dans URL */}
        {!searchParams.get("token") && (
          <div className="input-group">
            <label>Token</label>
            <input
              placeholder="Collez votre token"
              required
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        )}

        <div className="input-group">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Réinitialisation..." : "Réinitialiser"}
        </button>
      </form>

      <p className="toggle-text">
        Retour à la <Link to="/login">connexion</Link>
      </p>
    </AuthLayout>
  );
}
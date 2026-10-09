import { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import { login } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaGoogle, FaApple } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Easter egg
  const [typed, setTyped] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newTyped = (typed + e.key).toLowerCase();
      const trimmed = newTyped.slice(-6);

      setTyped(trimmed);

      if (trimmed === "velora") {
        setShowWelcome(true);

        setTimeout(() => {
          setShowWelcome(false);
        }, 3000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typed]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(form.email, form.password);

      const token = res.data.data.access_token;
      const user = res.data.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      toast.success("Connexion réussie");

      setTimeout(() => {
        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Titre animé + easter egg */}
      <h2
        className={`title-gradient title-animate ${
          showWelcome ? "welcome-animate" : ""
        }`}
      >
        {showWelcome ? "Bienvenue !" : "Bienvenue"}
      </h2>

      <p className="subtitle">
        Connectez-vous pour gérer vos réservations.
      </p>

      <form onSubmit={handleSubmit}>
        {/* EMAIL */}
        <div className="input-group">
          <label>Email</label>
          <div className="input-wrapper">
            <MdEmail className="input-icon" />
            <input
              type="email"
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="input-group">
          <label>Mot de passe</label>
          <div className="input-wrapper">
            <RiLockPasswordLine className="input-icon" />
            <input
              type="password"
              required
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <Link to="/forgot" className="forgot-link">
            Mot de passe oublié ?
          </Link>
        </div>

        {/* BUTTON */}
        <button className="btn-primary" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* SOCIAL */}
      <div className="divider">ou continuer avec</div>

      <div className="social-login">
        <button className="btn-social">
          <FaGoogle /> Google
        </button>

        <button className="btn-social">
          <FaApple /> Apple
        </button>
      </div>

      {/* REGISTER */}
      <p className="toggle-text">
        Pas encore membre ? <Link to="/register">S'inscrire</Link>
      </p>
    </AuthLayout>
  );
}
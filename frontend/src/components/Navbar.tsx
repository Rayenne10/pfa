import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { isLoggedIn } from "../api/auth.api";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ou ce que tu utilises
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          Velora Hotels
        </a>

        <ul className="navbar-menu">
          <li><a href="/#about-section">À propos</a></li>
          <li><Link to="/hotels">Hôtels</Link></li>
          <li><Link to="/contact">Contact</Link></li>

          {/* 👇 visible seulement si connecté */}
          {loggedIn && (
            <><li><Link to="/reservations">Réservations</Link></li><li><Link to="/profile">Profil</Link></li></>
          )}
        </ul>

        <div className="navbar-buttons">
          {!loggedIn ? (
            <>
              <Link to="/login" className="btn-login">Se connecter</Link>
              <Link to="/register" className="btn-register">S'inscrire</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-register">
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
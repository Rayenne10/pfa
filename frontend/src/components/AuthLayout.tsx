import "../styles/auth.css";

export default function AuthLayout({ children }: any) {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT */}
        <div className="auth-visual">
          <div className="visual-overlay"></div>

          <div className="visual-content">
            <div className="velora-img-logo"></div>

            <div className="text-wrapper">
              <h1>Velora</h1>
              <p>
                Votre prochaine évasion commence ici. Découvrez des hôtels
                d'exception partout dans le monde.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-form-section">
          <div className="form-box">{children}</div>
        </div>
      </div>
    </div>
  );
}
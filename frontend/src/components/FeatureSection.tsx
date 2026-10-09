import "../styles/landing.css";

export default function FeatureSection() {
    return (
<section id="about-section" className="about-section">
    <div className="about-header-text">
        <h2>À propos de Velora Hotels</h2>
        <p>
            Nous nous engageons à offrir des expériences uniques et mémorables à chaque séjour,
            que ce soit pour affaires ou pour le plaisir.
        </p>
    </div>

    <div className="features-container">
        <div className="feature">
            <h3>Hôtels de qualité</h3>
            <p>Découvrez des hôtels triés sur le volet partout dans le monde.</p>
        </div>
        <div className="feature">
            <h3>Réservation simple</h3>
            <p>Réservez en quelques clics et profitez de votre séjour.</p>
        </div>
        <div className="feature">
            <h3>Support 24/7</h3>
            <p>Notre équipe est là pour vous aider à chaque étape.</p>
        </div>
    </div>
</section>
)
}
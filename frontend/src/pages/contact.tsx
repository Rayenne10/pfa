import "../styles/contact.css";
import eyaImg from "../assets/eya.jpg";
import mayesImg from "../assets/mayes.jpg";
import rayenneImg from "../assets/rayenne.jpg";
import makniiImg from "../assets/maknii.jpg";
import Navbar from "../components/Navbar";

const team = [
  {
    name: "Eya Makni",
    role: "Responsable Marketing",
    img:makniiImg,
  },
  {
    name: "Mayess Boussaada",
    role: "Barman",
    img: mayesImg,
  },
  {
    name: "Rayenne Abid",
    role: "Maître d'hôtel",
    img: rayenneImg,
  },
  {
    name: "Eya Ben Slama",
    role: "RH",
    img: eyaImg,
  },
];

export default function Contact() {
  return (

    <div className="contact-page">
<Navbar />
      <div className="contact-header">
        <h1>Notre Équipe</h1>
        <p>Découvrez les personnes derrière Velora</p>
      </div>

      <div className="team-grid">
        {team.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.img} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
import { useState } from "react";
import { createHotel } from "../../../api/hotel.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../../styles/AdminHotels.css";
export default function CreateHotel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createHotel(form);
      toast.success("Hôtel créé");

      navigate("/admin/hotels"); 

    } catch {
      toast.error("Erreur");
    }
  };

  return (
    <div className="landing-page hotels-page">

      <h1 className="about-header">Créer un hôtel</h1>

      <form onSubmit={handleSubmit} className="admin-form">

        <input
          placeholder="Nom"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Adresse"
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button className="btn-primary">Créer</button>
      </form>
    </div>
  );
}
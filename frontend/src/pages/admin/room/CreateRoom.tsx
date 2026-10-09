import { useState } from "react";
import { createRoom } from "../../../api/room.api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Select from "react-select";

export default function CreateRoom() {
  const navigate = useNavigate();
  const { id: hotelIdParam } = useParams(); // récupère l'id de l'URL

const [form, setForm] = useState({
  roomNumber: "",
  type: "SINGLE",
  capacity: "",
  price: "",
  description: "",
  features: [] as string[],
});

  const featuresList = [
  "WiFi",
  "Climatisation",
  "TV",
  "Mini Bar",
  "Vue sur mer",
  "Balcon",
];

const handleFeatureChange = (feature: string) => {
  if (form.features.includes(feature)) {
    setForm({
      ...form,
      features: form.features.filter((f) => f !== feature),
    });
  } else {
    setForm({
      ...form,
      features: [...form.features, feature],
    });
  }
};

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createRoom({
        ...form,
        hotelId: Number(hotelIdParam), // utilise l'id de l'URL
        capacity: Number(form.capacity),
        price: Number(form.price),
      });

      toast.success("Chambre créée");
      navigate(`/admin/hotels/${hotelIdParam}`); // retourne à la page hôtel
    } catch {
      toast.error("Erreur");
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "14px",
      padding: "5px",
      color: "white",
    }),
    menu: (base: any) => ({
      ...base,
      background: "#1e1e2f",
    }),
    option: (base: any, state: any) => ({
      ...base,
      background: state.isFocused ? "#6366f1" : "#1e1e2f",
      color: "white",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "white",
    }),
  };

  return (
    <div className="landing-page hotels-page">
      <h1 className="about-header">Créer une chambre</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="Numéro"
          onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
        />

        <Select
          styles={{
            ...customStyles,
            container: (base) => ({
              ...base,
              width: "100%",
            }),
          }}
          options={[
            { value: "SINGLE", label: "Single" },
            { value: "DOUBLE", label: "Double" },
            { value: "SUITE", label: "Suite" },
          ]}
          value={{ value: form.type, label: form.type }}
          onChange={(selected: any) =>
            setForm({ ...form, type: selected.value })
          }
        />

        <input
          placeholder="Capacité"
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />

        <input
          placeholder="Prix"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        {/* Description */}
<input
  placeholder="Description"
  value={form.description}
  onChange={(e) => setForm({ ...form, description: e.target.value })}
/>

<div className="features-group">
  <label>Features :</label>

  <div className="features-list">
    {featuresList.map((feature) => (
      <label
        key={feature}
        className={`feature-item ${
          form.features.includes(feature) ? "active" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={form.features.includes(feature)}
          onChange={() => handleFeatureChange(feature)}
        />
        {feature}
      </label>
    ))}
  </div>
</div>

        <button className="btn-primary">Créer</button>
      </form>
    </div>
  );
}
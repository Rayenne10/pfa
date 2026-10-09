import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoomById, updateRoom } from "../../../api/room.api";
import toast from "react-hot-toast";
import Select from "react-select";

export default function UpdateRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roomNumber: "",
    hotelId: "", // on garde pour envoyer au backend
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
      setForm({ ...form, features: form.features.filter((f) => f !== feature) });
    } else {
      setForm({ ...form, features: [...form.features, feature] });
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(Number(id));
        const room = res.data;

        setForm({
          roomNumber: room.roomNumber,
          hotelId: room.hotelId,
          type: room.type,
          capacity: room.capacity,
          price: room.price,
          description: room.description || "",
          features: room.features || [],
        });
      } catch {
        toast.error("Erreur chargement");
      }
    };

    fetchRoom();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await updateRoom(Number(id), {
        roomNumber: form.roomNumber,
        hotelId: Number(form.hotelId),
        type: form.type,
        capacity: Number(form.capacity),
        price: Number(form.price),
        description: form.description,
        features: form.features,
      });

      toast.success("Chambre mise à jour");
      navigate(-1); // retourne à la page précédente
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur update");
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
      <h1 className="about-header">Modifier chambre</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="Numéro"
          value={form.roomNumber}
          onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
        />

        <Select
          styles={{
            ...customStyles,
            container: (base: any) => ({ ...base, width: "100%" }),
          }}
          options={[
            { value: "SINGLE", label: "Single" },
            { value: "DOUBLE", label: "Double" },
            { value: "SUITE", label: "Suite" },
          ]}
          value={{ value: form.type, label: form.type }}
          onChange={(selected: any) => setForm({ ...form, type: selected.value })}
        />

        <input
          placeholder="Capacité"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />

        <input
          placeholder="Prix"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        {/* Description */}
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Features */}
        <div className="features-group">
          <label>Features :</label>
          <div className="features-list">
            {featuresList.map((feature) => (
              <label
                key={feature}
                className={`feature-item ${form.features.includes(feature) ? "active" : ""}`}
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

        <button className="btn-primary">Sauvegarder</button>
      </form>
    </div>
  );
}
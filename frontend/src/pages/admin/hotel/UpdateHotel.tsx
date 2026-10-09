import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelById, updateHotel } from "../../../api/hotel.api";
import toast from "react-hot-toast";
import "../../../styles/AdminHotels.css";

export default function UpdateHotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
  });

useEffect(() => {
  const fetch = async () => {
    const hotel = await getHotelById(Number(id));

    setForm({
      name: hotel.name,
      address: hotel.address,
      description: hotel.description,
    });
  };

  fetch();
}, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

await updateHotel(Number(id), {
  name: form.name,
  address: form.address,
  description: form.description,
});    toast.success("Modifié");

    navigate("/admin/hotels");
  };

  return (
    <div className="landing-page hotels-page">

      <h1 className="about-header">Modifier hôtel</h1>

      <form onSubmit={handleSubmit} className="admin-form">

        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button className="btn-primary">
          Sauvegarder
        </button>

      </form>
    </div>
  );
}
import axios from "axios";

const API = "http://localhost:3003/admin/rooms";
const API_AVAILABLE = "http://localhost:3004/reservations/available-rooms";

export const getAllRooms = () => axios.get(API);

export const getRoomById = (id: number) =>
  axios.get(`${API}/${id}`);

export const getRoomsByHotel = (hotelId: number) =>
  axios.get(`${API}/hotel/${hotelId}`);

export const createRoom = (data: any) =>
  axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const updateRoom = (id: number, data: any) =>
  axios.patch(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const deleteRoom = (id: number) =>
  axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const getAvailableRooms = async (
  hotelId: string | number,
  start: string,
  end: string
) => {
  try {
    const response = await axios.get(`${API_AVAILABLE}`, {
      params: {
        start,
        end,
        hotelId,
      },
    });
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des chambres disponibles:", error);
    throw error;
  }
};
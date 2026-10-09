import axios from "axios";

const API = "http://localhost:3003/admin/hotels";

export interface Hotel {
  id: number;
  name: string;
  address: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllHotels = async (): Promise<Hotel[]> => {
  const res = await axios.get<Hotel[]>(API);
  return res.data;
};

export const getHotelById = async (id: number): Promise<Hotel> => {
  const res = await axios.get<Hotel>(`${API}/${id}`);
  return res.data;
};

export const createHotel = async (data: {
  name: string;
  address: string;
  description?: string;
}) => {
  return axios.post(API, data, authHeader());
};

export const updateHotel = async (
  id: number,
  data: Partial<Hotel>
) => {
  return axios.put(`${API}/${id}`, data, authHeader());
};

export const deleteHotel = async (id: number) => {
  return axios.delete(`${API}/${id}`, authHeader());
};

export const restoreHotel = async (id: number) => {
  return axios.patch(`${API}/${id}/restore`, {}, authHeader());
};
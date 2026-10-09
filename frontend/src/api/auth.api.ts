import axios from 'axios';

const API = 'http://localhost:3002/auth';

export const login = (email: string, password: string) => {
  return axios.post(`${API}/login`, { email, password });
};

export const register = (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  return axios.post(`${API}/register`, {
    email,
    password,
    firstName,
    lastName,
  });
};

export const requestReset = (email: string) => {
  return axios.post(`${API}/request-reset`, { email });
};

export const resetPassword = (token: string, password: string) => {
  return axios.post(`${API}/reset-password`, { token, password });
};

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return !!token && role === "USER";
};



const API_URL_USERS = "http://localhost:3001/users"; // adapter si besoin

export const getMe = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await axios.get(`${API_URL_USERS}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // renvoie les infos de l'utilisateur
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL_USERS, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error;
  }
};


export const updateUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  id: number;
}) => {
  try {
    const { id, ...body } = userData;
    const response = await axios.patch(`${API_URL_USERS}/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Erreur updateUser:", error);
    throw error;
  }
};
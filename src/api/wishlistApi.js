import axios from "axios";
const API_URL = "http://localhost:5000/api/wishlist";
export const getWishlistApi = async (token) => {
  const response = await axios.get(API_URL, {headers: {Authorization: `Bearer ${token}`,},});
  return response.data;
};

export const addWishlistApi = async (productId, token) => {
  const response = await axios.post(`${API_URL}/${productId}`,{},{headers: {Authorization: `Bearer ${token}`,},});
  return response.data;
};

export const removeWishlistApi = async (productId, token) => {
  const response = await axios.delete(`${API_URL}/${productId}`,{headers: {Authorization: `Bearer ${token}`,},});
  return response.data;
};
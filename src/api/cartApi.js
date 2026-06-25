import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

export const getCart = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addToCartApi = async (
  productId,
  quantity,
  token
) => {
  const response = await axios.post(
    API_URL,
    {
      productId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const removeFromCartApi = async (
  productId,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const updateCartQuantityApi = async (
  productId,
  quantity,
  token
) => {
  const response = await axios.put(
    API_URL,
    {
      productId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
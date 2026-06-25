import axios from "axios";
const API_URL ="http://localhost:5000/api/orders";
export const createOrderApi = async (paymentData,token) => {
    const response = await axios.post(API_URL,paymentData,{headers: {Authorization: `Bearer ${token}`}});
    return response.data;
  };

export const getMyOrdersApi =async (token) => {
  const response =await axios.get(`${API_URL}/myorders`,{headers: {Authorization:`Bearer ${token}`,},});
  return response.data;
};

export const getAllOrdersApi = async (token) => {
  const response = await axios.get(API_URL,{headers: {Authorization: `Bearer ${token}`,},});
  return response.data;
};

export const updateOrderStatusApi = async (orderId,status,token) => {
  const response = await axios.put(`${API_URL}/${orderId}/status`,{ status },{headers: {Authorization: `Bearer ${token}`,},});
  return response.data;
};
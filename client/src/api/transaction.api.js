import api from "./client";

const API_URL = "transactions";

const config = {
  withCredentials: true,
};

export const getTransactions = async (params = {}) => {
  const response = await api.get(API_URL, {
    ...config,
    params,
  });

  return response.data;
};

export const getTransactionCategories = async () => {
  const response = await api.get(`${API_URL}/categories`, config);
  return response.data.data;
};

export const createTransaction = async (transaction) => {
  const response = await api.post(API_URL, transaction, config);
  return response.data;
};

export const updateTransaction = async (id, transaction) => {
  const response = await api.patch(
    `${API_URL}/${id}`,
    transaction,
    config,
  );
  return response.data;
};

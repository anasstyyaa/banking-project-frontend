import api from './axios';

export const fetchTransactions = async (filters = {}) => {
  const response = await api.get('/transactions', { params: cleanParams(filters) });
  return response.data;
};

export const fetchTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await api.post('/transactions', transaction);
  return response.data;
};

const cleanParams = (filters) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
};

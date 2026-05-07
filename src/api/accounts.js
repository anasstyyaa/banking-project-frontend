import api from './axios';

export const fetchAccounts = async () => {
  const response = await api.get('/accounts');
  return response.data;
};

export const fetchAccountByIban = async (iban) => {
  const response = await api.get(`/accounts/${iban}`);
  return response.data;
};

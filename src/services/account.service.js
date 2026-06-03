import api from '@/api/axios';

class AccountService {
  getAccounts() {
    return api.get('/accounts');
  }

  getAccountByIban(iban) {
    return api.get(`/accounts/${iban}`);
  }

  search(query) {
    return api.get('/accounts/search', { params: { query } });
  }

  updateLimits(iban, payload) {
    return api.patch(`/accounts/${iban}/limits`, payload);
  }
}

export default new AccountService();

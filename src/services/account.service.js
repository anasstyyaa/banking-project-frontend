import api from '@/api/axios';

class AccountService {
  getAccounts(params = {}) {
    return api.get('/accounts', { params: this.cleanParams(params) });
  }

  getAccountByIban(iban) {
    return api.get(`/accounts/${iban}`);
  }

  search(query, params = {}) {
    return api.get('/accounts/search', { params: this.cleanParams({ query, ...params }) });
  }

  createAccount(payload) {
    return api.post('/accounts', payload);
  }

  updateLimits(iban, payload) {
    return api.patch(`/accounts/${iban}/limits`, payload);
  }

  cleanParams(params) {
    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
    );
  }
}

export default new AccountService();

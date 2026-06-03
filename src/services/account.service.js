import api from '@/api/axios';

class AccountService {
  getAccounts() {
    return api.get('/accounts');
  }

  getAccountByIban(iban) {
    return api.get(`/accounts/${iban}`);
  }

  searchByName(name) {
  return api.get('/accounts/search', { params: { name } });
}
}

export default new AccountService();

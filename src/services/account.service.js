import api from '@/api/axios';

class AccountService {
  getAccounts() {
    return api.get('/accounts');
  }

  getAccountByIban(iban) {
    return api.get(`/accounts/${iban}`);
  }
}

export default new AccountService();

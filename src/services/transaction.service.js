import api from '@/api/axios';

class TransactionService {
  getTransactions(filters = {}) {
    return api.get('/transactions', { params: this.cleanParams(filters) });
  }

  getTransactionById(id) {
    return api.get(`/transactions/${id}`);
  }

  createTransaction(transaction) {
    return api.post('/transactions', transaction);
  }

  cleanParams(filters) {
    return Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
    );
  }
}

export default new TransactionService();

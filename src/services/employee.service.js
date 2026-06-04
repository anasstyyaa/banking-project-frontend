import api from '@/api/axios'; 

class EmployeeService {
  getPendingRegistrations() {
    return api.get('/employee/pending');
  }

  getActiveCustomers() {
    return api.get('/employee/customers'); 
  }

  getAllSystemAccounts(params = {}) {
    return api.get('/accounts', { params }); 
  }

  approveUser(userId) {
    return api.post(`/employee/approve/${userId}`);
  }

  denyUser(userId) {
    return api.delete(`/employee/deny/${userId}`);
  }

  createCustomerAccount(userId, payload) {
    return api.post('/accounts', { customerUserId: userId, ...payload });
  }
}

export default new EmployeeService();

import api from '@/api/axios'; 

class EmployeeService {
  getPendingRegistrations() {
    return api.get('/employee/pending');
  }

  getActiveCustomers() {
    return api.get('/employee/customers'); 
  }

  getAllSystemAccounts() {
    return api.get('/accounts'); 
  }

  approveUser(userId) {
    return api.post(`/employee/approve/${userId}`);
  }

  denyUser(userId) {
    return api.delete(`/employee/deny/${userId}`);
  }

  createCustomerAccount(userId, accountType) {
    return api.post(`/employee/customers/${userId}/accounts`, {
      accountType: accountType
    });
  }
}

export default new EmployeeService();
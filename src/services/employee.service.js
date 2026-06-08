import api from '@/api/axios'; 

class EmployeeService {
  
  getRegistrations(status, params = {}) {
    return api.get('/employee/registrations', { params: { status, ...params } });
  }

  updateRegistrationStatus(id, payload) {
    return api.patch(`/employee/registrations/${id}`, payload);
  }

  getAllSystemAccounts(params = {}) {
    return api.get('/accounts', { params }); 
  }

  createCustomerAccount(userId, payload) {
    return api.post('/accounts', { customerUserId: userId, ...payload });
  }
}

export default new EmployeeService();

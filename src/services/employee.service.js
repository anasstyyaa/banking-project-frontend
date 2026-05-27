import api from '@/api/axios'; 

class EmployeeService {
  getPendingRegistrations() {
    return api.get('/employee/pending-registrations');
  }

  getActiveCustomers() {
    return api.get('/employee/active-customers'); 
  }

  approveUser(userId) {
    return api.post(`/employee/approve/${userId}`);
  }

  denyUser(userId) {
    return api.delete(`/employee/deny/${userId}`);
  }
}

export default new EmployeeService();
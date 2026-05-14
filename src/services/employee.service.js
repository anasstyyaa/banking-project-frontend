import api from '@/api/axios'; 

class EmployeeService {
  getPendingRegistrations() {
    return api.get('/employee/pending-registrations');
  }

  approveUser(userId) {
    return api.post(`/employee/approve/${userId}`);
  }

  denyUser(userId) {
    return api.delete(`/employee/deny/${userId}`);
  }
}

export default new EmployeeService();
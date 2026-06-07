import api from '@/api/axios';

class AuthService {
  logout() {
    localStorage.clear();
  }
}
export default new AuthService();
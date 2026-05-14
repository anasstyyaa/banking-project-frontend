import api from '@/api/axios';

class AuthService {
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log("Backend logout endpoint not found or unreachable.");
    } finally {
      localStorage.clear();
    }
  }
}
export default new AuthService();
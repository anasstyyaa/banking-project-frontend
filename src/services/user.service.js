import api from '@/api/axios';

class UserService {
  getProfile() {
    return api.get('/users/profile');
  }

  updateProfile(profile) {
    return api.put('/users/profile', profile);
  }
}

export default new UserService();

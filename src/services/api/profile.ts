import api from '../api';

export const profile = {
  get: async () => {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (data: any) => {
    try {
      const response = await api.put('/profile/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const response = await api.post('/profile/change-password/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/profile/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBusinessDetails: async () => {
    try {
      const response = await api.get('/profile/business/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBusinessDetails: async (data: any) => {
    try {
      const response = await api.put('/profile/business/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
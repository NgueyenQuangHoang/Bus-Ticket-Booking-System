import api from '../api/api';
import type { Banner } from '../types/index';

export const bannerService = {
  // TypeScript sẽ đảm bảo hàm này trả về một mảng Banner
  getAllBanners: async (): Promise<Banner[]> => {
    try {
      const response = await api.get<Banner[]>('/banners');
      return response as unknown as Banner[];
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  }
};
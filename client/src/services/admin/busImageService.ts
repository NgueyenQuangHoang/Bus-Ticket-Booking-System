import api from '../../api/api';
import type { BusImage } from '../../types/bus';

export const busImageService = {
    getImagesByBusId: async (busId: number | string): Promise<BusImage[]> => {
        try {
            const response = await api.get(`/bus_images?bus_id=${busId}`);
            return response as unknown as BusImage[];
        } catch (error) {
            console.error('Error fetching bus images:', error);
            throw error;
        }
    },

    getAllImages: async (): Promise<BusImage[]> => {
        try {
            const response = await api.get('/bus_images');
            return response as unknown as BusImage[];
        } catch (error) {
            console.error('Error fetching all bus images:', error);
            throw error;
        }
    },

    createBusImage: async (data: Omit<BusImage, 'bus_image_id' | 'id'>): Promise<BusImage> => {
        try {
            const response = await api.post('/bus_images', data);
            return response as unknown as BusImage;
        } catch (error) {
            console.error('Error creating bus image:', error);
            throw error;
        }
    },

    /**
     * Mock upload - mostly for sending URL string to backend
     */
    uploadBusImage: async (busId: number | string, imageUrl: string): Promise<BusImage> => {
        try {
            // For now, we assume we just save the record with URL. 
            // In a real app, we might upload file to Cloudinary first.
            const data = {
                bus_id: Number(busId), // Ensure standard type if backend expects number
                image_url: imageUrl
            };
            const response = await api.post('/bus_images', data);
            return response as unknown as BusImage;
        } catch (error) {
            console.error('Error uploading bus image:', error);
            throw error;
        }
    },

    deleteBusImage: async (id: string): Promise<void> => {
        try {
            await api.delete(`/bus_images/${id}`);
        } catch (error) {
            console.error('Error deleting bus image:', error);
            throw error;
        }
    }
};

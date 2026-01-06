import api from '../../api/api';
import type { BusImage } from '../../types/bus';
import { v4 as uuidv4 } from 'uuid';

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
     * Upload file to Cloudinary
     */
    uploadFileToCloudinary: async (file: File): Promise<string> => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary configuration is missing in .env");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Upload failed");
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
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
            const newId = uuidv4();
            const data = {
                id: newId,
                bus_id: busId, // Removed Number() casting
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

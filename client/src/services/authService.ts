import api from "../api/api";
import type { User } from "../types";

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface RegisterResponse {
    accessToken: string;
    user: User;
}

export const authService = {
    login: async (credentials: Pick<User, 'email' | 'password'>): Promise<LoginResponse> => {
        const response = await api.post('/login', credentials);
        return response as unknown as LoginResponse;
    },

    register: async (userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<RegisterResponse> => {
        const response = await api.post('/register', userData);
        return response as unknown as RegisterResponse;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
    },
    
    getCurrentUser: async (): Promise<User> => {
         // Assuming there is an endpoint /me or logic to get current user
         // If not, we might rely on what's stored in local storage or login response
         const response = await api.get('/me'); 
         return response as unknown as User;
    }
};

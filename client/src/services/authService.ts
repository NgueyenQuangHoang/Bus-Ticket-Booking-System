import api from "../api/api";
import type { User } from "../types";

export interface LoginResponse {
    user: User;
}

export interface RegisterResponse {
    user: User;
}

export const authService = {
    login: async (credentials: Pick<User, 'email' | 'password'>): Promise<User | undefined> => {
        try {
            const {email, password} = credentials
            const response : User[] = await api.get('/users')
            const data = response.find((item) => item.email === email && item.password === password)
            console.log(data);
            if (data){
                localStorage.setItem('user', JSON.stringify(data))
                localStorage.setItem('isLogin', JSON.stringify(true))
            }
            return data
        } catch (error) {
            console.error(error);
            return undefined
            throw error
        }
    },

    register: async (userData: Omit<User, 'status' | 'user_id' | 'created_at' | 'updated_at'>): Promise<User | undefined> => {
        try {
            const getUser : User[] = await api.get('users')
            const {email} = userData
            const checkEmail = getUser.find(item => item.email == email)
            if (checkEmail){
                alert('Da ton tai email')
                return undefined
            }
            const user_id = getUser[getUser.length-1].user_id+1
            const response: User = await api.post('users', {
                ...userData,
                created_at: new Date(),
                updated_at: new Date(),
                status: "ACTIVE",
                user_id
            })
            localStorage.setItem('user', JSON.stringify(response))
            localStorage.setItem('isLogin', JSON.stringify(true))
            return response
        } catch (error) {
            console.log(error);
            return undefined
            throw error
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin')
        return false
    },

    getCurrentUser: async (): Promise<User> => {
        // Assuming there is an endpoint /me or logic to get current user
        // If not, we might rely on what's stored in local storage or login response
        const response = await api.get('/me');
        return response as unknown as User;
    }
};

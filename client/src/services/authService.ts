import api from "../api/api";
import type { Role, User, UserRole } from "../types";
import { v4 as uuidv4 } from "uuid";


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
            if (data){
                localStorage.setItem('user', JSON.stringify(data))
                localStorage.setItem('isLogin', JSON.stringify(true))
            }
            return data
        } catch (error) {
            console.error(error);
            return undefined
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
            const user_id = uuidv4()
            const response: User = await api.post('users', {
                ...userData,
                created_at: new Date(),
                updated_at: new Date(),
                status: "ACTIVE",
                user_id,
            })
            const newId = uuidv4()
            await api.post('user_role', {user_id, role_id: 1, id: newId})
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
    },

    getRoleUser: async (user_id: number | string) : Promise<Role[] | undefined> => {
        try {
            const responseGetRole: Role[] = await api.get('http://localhost:8080/roles')
            const responseGetUserRole: UserRole[] = await api.get('http://localhost:8080/user_role?user_id=' + user_id)
            
            const dataUser = responseGetUserRole.filter((item) => item.user_id == user_id)
            const roleMap = responseGetRole.reduce((acc, current) => {
                acc[current.role_id] = current
                return acc
            }, {} as Record<string, Role>)
            
            
            const dataReturn = dataUser.reduce((acc ,item) => {
                acc.push(roleMap[item.role_id])
                return acc
            }, [] as Role[])
            localStorage.setItem('role', JSON.stringify(dataReturn))


            return dataReturn
        } catch (error) {
            console.log(error);
        }
    },
    deleteUser: async (id: number | string, user_id: number | string): Promise<void> => {
        try {
            await api.delete('/users/'+id)
            const responseUR: UserRole[] = await api.get('user_role?user_id='+user_id)
            responseUR.forEach(element => {
                console.log(element.id);
                
                api.delete('/user_role/'+element.id)
            });
        } catch (error) {
            console.log(error);
            
        }
    },
    getRoles: async (): Promise<Role[] | undefined> => {
        try {
            const roles: Role[] = await api.get('/roles')
            return roles
        } catch (error) {
            console.log(error);
            return undefined
        }
    },
    updateRoleUser: async (id: number | string, userRole: UserRole): Promise<void> => {
        try {
            await api.put('/user_role/'+id, userRole)
        } catch (error) {
            console.log(error);
            
        }
    },
    getAllUsers: async (): Promise<User[]> => {
        try {
            const response: User[] = await api.get('/users')
            return response
        } catch (error) {
            console.log(error);
            return []
        }
    },
    createUser: async(infoUser: User, user_role: UserRole) : Promise<void> => {
        try {
            console.log(infoUser);
            console.log(user_role);
            await api.post('/users', infoUser)
            await api.post('/user_role', user_role)
        } catch (error) {
            console.log(error);
        }
    },
    updateStatus: async(id: string | number, uFix: User): Promise<void>=> {
        try {
            await api.put('/users/'+id, uFix )
        } catch (error) {
            console.log(error);
            
        }
    },
    updateUser: async(id: string | number, uFix: User, role: string): Promise<void>=>{
        try {
            await api.put('/users/'+id, uFix)
            const response: UserRole[] = await api.get('/user_role?user_id='+uFix.user_id)
            const idUR = response[0].id
            await api.put('/user_role/'+idUR, {user_id: uFix.user_id, role_id: role == 'ADMIN' ? '2' : role == 'USER' ? '1' : '3'})
        } catch (error) {
            console.log(error);
        }
    }
};

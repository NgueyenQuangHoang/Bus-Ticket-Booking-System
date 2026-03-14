import api from "../api/api";
import type { Role, User, UserRole } from "../types";


export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterResponse {
    token: string;
    user: User;
}

export const authService = {
    login: async (credentials: Pick<User, 'email' | 'password'>): Promise<Omit<User, 'password'> | undefined> => {
        try {
            const response: LoginResponse = await api.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });

            if (response && response.token && response.user) {
                localStorage.setItem('accessToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('isLogin', JSON.stringify(true));
                return response.user;
            }
            return undefined;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    },

    register: async (userData: Omit<User, 'status' | 'created_at' | 'updated_at'>): Promise<User | undefined> => {
        try {
            const response: RegisterResponse = await api.post('/auth/register', {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                id: userData.id
            });

            if (response && response.token && response.user) {
                localStorage.setItem('accessToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('isLogin', JSON.stringify(true));
                return response.user;
            }
            return undefined;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    },

    logout: () => {
        // Fire and forget the server-side logout
        api.post('/auth/logout').catch(() => {});
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin');
        localStorage.removeItem('role');
        localStorage.removeItem('bus_company_id');
        return false;
    },

    getRoleUser: async (id: number | string): Promise<(UserRole & { role_name: string })[]> => {
        try {
            const roles: (UserRole & { role_name: string })[] = await api.get(`/users/${id}/roles`);
            return roles;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getCurrentUser: async (): Promise<User> => {
        const response: User = await api.get('/auth/me');
        return response;
    },

    getRole_User: async (): Promise<UserRole[]> => {
        try {
            // This endpoint no longer exists as a flat list.
            // Return empty array; callers should use getRoleUser(id) instead.
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    deleteUser: async (id: number | string): Promise<void> => {
        try {
            // Backend handles cascade deletion of user_role
            await api.delete('/users/' + id);
        } catch (error) {
            console.log(error);
        }
    },

    getRoles: async (): Promise<Role[] | undefined> => {
        try {
            const roles: Role[] = await api.get('/roles');
            return roles;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    },

    updateRoleUser: async (id: number | string, userRole: UserRole): Promise<void> => {
        try {
            await api.put(`/users/${userRole.user_id}/roles`, { roleIds: [userRole.role_id] });
        } catch (error) {
            console.log(error);
        }
    },

    getAllUsers: async (): Promise<User[]> => {
        try {
            const response: User[] = await api.get('/users');
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    createUser: async (infoUser: User, user_role: UserRole): Promise<void> => {
        try {
            await api.post('/users', {
                ...infoUser,
                role_id: user_role.role_id
            });
        } catch (error) {
            console.log(error);
        }
    },

    updateStatus: async (uFix: User): Promise<void> => {
        try {
            await api.put('/users/' + uFix.id, { status: uFix.status });
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (uFix: User, role: string): Promise<void> => {
        try {
            await api.put('/users/' + uFix.id, uFix);
            await api.put(`/users/${uFix.id}/roles`, { roleIds: [role] });
        } catch (error) {
            console.log(error);
        }
    },

    createRole: async (role: Role) => {
        await api.post('/roles', role);
        return role;
    },
    updateRole: async (role: Role) => {
        await api.put('/roles/' + role.id, role);
        return role;
    },
    deleteRole: async (role: Role) => {
        await api.delete('/roles/' + role.id);
        return role;
    },
    loginAdmin: async (
        credentials: Pick<User, 'email' | 'password'>
    ): Promise<Omit<User, 'password'> | undefined> => {
        try {
            const response: any = await api.post('/auth/login-admin', {
                email: credentials.email,
                password: credentials.password
            });

            if (!response || !response.token || !response.user) return undefined;

            const { token, user, role, bus_company_id } = response;

            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLogin', JSON.stringify(true));
            localStorage.setItem('role', JSON.stringify(role));
            if (bus_company_id) {
                localStorage.setItem('bus_company_id', JSON.stringify(bus_company_id));
            }

            return user;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
};

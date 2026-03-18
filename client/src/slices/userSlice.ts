import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Role, User, UserRole } from "../types";
import { authService } from "../services/authService";

interface UserSliceType {
    users: User[],
    roles: Role[],
    user_roles: UserRole[]
    loading: boolean,
    error: string|null
}

const initialState : UserSliceType = {
    users: [],
    roles: [],
    user_roles: [],
    loading: false,
    error: null
}

export const fetchUsers = createAsyncThunk('user/fetchData', async () => {
    try {
        const response = await authService.getAllUsers()
        return response
    } catch (error) {
        console.log(error);
        return []
    }
})

export const PostNewRole = createAsyncThunk('user/postRole', async(role: Role) => {
    const response = await authService.createRole(role)
    return response
})

export const fetchUser_Roles = createAsyncThunk('user/fetchUser_role', async() => {
    const response = await authService.getRole_User()
    return response
})

export const fetch_Roles = createAsyncThunk('user/fetchRole', async() => {
    const response = await authService.getRoles()
    return response
})

export const postNewUser = createAsyncThunk('user/postUser', async({user, ur}: {user: User, ur: UserRole}) => {
    await authService.createUser(user, ur)
    return {user, ur}
})

export const removeUser = createAsyncThunk('user/removeUser', async({idU} : {idU :number|string}) => {
    await authService.deleteUser(idU)
    return idU
})

export const updateUser = createAsyncThunk('user/updateUser', async (input : {user: User, roleId: string}) => {
    const {user, roleId} = input
    await authService.updateUser(user, roleId)
    return input
})

export const updateStatus = createAsyncThunk('user/updateStatus', async (input : {user: User}) => {
    await authService.updateStatus(input.user)
    return input
})

export const updateRole = createAsyncThunk('user/updateRole', async (role: Role) => {
    await authService.updateRole(role)
    return role
})

export const deleteRole = createAsyncThunk('user/deleteRole', async (role: Role) => {
    await authService.deleteRole(role)
    return role
})

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload as User[]
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                const error = action.payload as string
                state.error = error
            })

        builder.addCase(fetch_Roles.fulfilled, (state, action) => {
            if(action.payload){
                state.roles = action.payload as unknown as Role[]
            }
        })
        
        builder
            .addCase(fetchUser_Roles.fulfilled, (state, action) => {
                state.user_roles = action.payload
            })

        builder
            .addCase(postNewUser.fulfilled, (state, action) => {
                const {user, ur} = action.payload
                const roleName = state.roles.find(r => r.id == ur.role_id)?.role_name || ''
                state.users = [...state.users, {...user, role_names: roleName, role_ids_list: String(ur.role_id)}]
                state.user_roles = [...state.user_roles, ur]
            })

        builder.addCase(removeUser.fulfilled, (state, action) => {
            const id = action.payload
            state.users = state.users.filter(item => item.id != id)
            state.user_roles = state.user_roles.filter(item => item.user_id != id)
        })

        builder
            .addCase(updateUser.fulfilled, (state, action) => {
                const {user, roleId} = action.payload
                const roleName = state.roles.find(r => r.id == roleId)?.role_name || ''
                state.users = state.users.map(item => {
                    if(item.id == user.id){
                        return {...user, role_names: roleName, role_ids_list: String(roleId)}
                    }
                    return item
                })
                state.user_roles = state.user_roles.map((ur) => {
                    if(ur.user_id == user.id){
                        return {...ur, role_id: roleId}
                    }
                    return ur
                })
            })

        builder.addCase(updateStatus.fulfilled, (state, action) => {
            const {user} =action.payload
            state.users= state.users.map(item => item.id == user.id ? user : item)
        })
        builder.addCase(PostNewRole.fulfilled, (state,action) => {
            const newRole = action.payload
            state.roles = [...state.roles, newRole]
        })
        builder.addCase(updateRole.fulfilled, (state, action) => {
            const role = action.payload as Role
            state.roles = state.roles.map(item => item.id == role.id ? role : item)
        })
        builder.addCase(deleteRole.fulfilled, (state, action) => {
            const role = action.payload as Role
            state.roles = state.roles.filter(item => item.id != role.id)
        })
    }
})

export default userSlice.reducer
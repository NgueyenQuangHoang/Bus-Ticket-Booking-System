import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserHeader from "./components/UserHeader";
import UserSearch from "./components/UserSearch";
import UserTable from "./components/UserTable";
import AddUserModal from "./components/AddUserModal";
import ViewUserModal from "./components/ViewUserModal";
import type { User, UserRole } from "../../../types";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetch_Roles, fetchUser_Roles, fetchUsers, postNewUser, removeUser, updateStatus, updateUser } from "../../../slices/userSlice";


export default function UsersPage() {
    const {users, roles: listRole, user_roles} = useAppSelector(state=> state.user)
    const dispatch = useAppDispatch()
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [statusForm, setStatus] = useState<'edit' | 'add'>('add')
    
    const roleMapping = listRole.reduce((acc: { [key: string | number]: string }, role) => {
        acc[role.id] = role.role_name
        return acc
    }, {})

    const urMapping = user_roles.reduce((acc: { [key: string | number]: string }, role) => {
        acc[role.user_id] = roleMapping[role.role_id]
        return acc
    }, {})


    const handleToggleStatus = (id: string, status: string) => {
        const user = users.find(item => item.id == id)
        const newUser = {...user, status} as User
        if(newUser){
            dispatch(updateStatus({user: newUser}))
        }
    };

    const handleAddUser = (newUser: Omit<User, 'status' | 'created_at' | 'updated_at'>, role_id: string) => {
            // Add new
            console.log(role_id);
            
            const user_id = uuidv4()
            const userToAdd: User = {
                ...newUser,
                id: user_id,
                first_name: newUser.first_name || "",
                last_name: newUser.last_name || "",
                email: newUser.email || "",
                phone: newUser.phone || "",
                status: "ACTIVE",
                password: newUser.password || "123456",
                created_at: (new Date()).toString(),
                updated_at: (new Date()).toString(),
            };
            const user_role : UserRole = {
                role_id: role_id,
                user_id
            }
            dispatch(postNewUser({user: userToAdd, ur: user_role}))
    };

    const handleEditClick = (user: User) => {
        setStatus('edit')
        setSelectedUser(user);
        setIsAddModalOpen(true);
    };

    const handleViewClick = (user: User) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleEdit = (user: User, role_id: string) => {
        dispatch(updateUser({user, roleId: role_id}))
    }

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user)
        Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn có chắc chắn muốn xóa người dùng "${user.first_name} ${user.last_name}" không?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa bỏ",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                // goi api xoa o day
                // setUsers(users.filter((u) => u.id !== user.id));
                // authService.deleteUser(user.id ? user.id : '', user.id)
                dispatch(removeUser({idU: user.id}))
                Swal.fire("Đã xóa!", "Người dùng đã được xóa thành công.", "success");
            }
        });
    };

    const filteredUsers = users.filter(
        (user) =>
            (user.first_name + " " + user.last_name)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phone && user.phone.includes(searchTerm))
    );

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetch_Roles())
        dispatch(fetchUser_Roles())
    }, [dispatch])

    
    console.log(urMapping, roleMapping);
    

    return (
        <div className="space-y-6">
            <UserHeader
                userCount={users.length}
                onAddClick={() => {
                    setSelectedUser(null);
                    setIsAddModalOpen(true);
                    setStatus('add')
                }}
            />

            <UserSearch setInputData={setSearchTerm} inputData={searchTerm}/>

            <UserTable
                users={filteredUsers}
                roles={urMapping}
                onToggleStatus={handleToggleStatus}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
                user={selectedUser ? {
                    ...selectedUser,
                    role_id: user_roles.find(ur => ur.user_id === selectedUser.id)?.role_id
                } as any : null}
                statusForm={statusForm}
                Edit={handleEdit}
            />

            <ViewUserModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                user={selectedUser}
                roleName={selectedUser ? urMapping[selectedUser.id] : ''}
            />
        </div>
    );
}

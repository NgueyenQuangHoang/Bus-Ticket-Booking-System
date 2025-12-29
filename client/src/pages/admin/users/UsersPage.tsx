import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserHeader from "./components/UserHeader";
import UserSearch from "./components/UserSearch";
import UserTable from "./components/UserTable";
import AddUserModal from "./components/AddUserModal";
import ViewUserModal from "./components/ViewUserModal";
import { authService } from "../../../services/authService";
import type { User, UserRole } from "../../../types";
import { v4 as uuidv4 } from "uuid";


const allUser: User[] = [];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(allUser);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<{ [x: string]: string }>({})
    const [statusForm, setStatus] = useState<'edit' | 'add'>('add')
    

    const handleToggleStatus = (id: string | number, status: string) => {
        console.log(id, status);
        
        setUsers(
            users.map((user) => {
                if (user.id === id) {
                    authService.updateStatus(id, { ...user, status: status })
                    return {
                        ...user,
                        status: status
                    };
                }
                return user;
            })
        );
        
    };

    const handleAddUser = (newUser: Omit<User,'status' | 'created_at' | 'updated_at'>, role: string) => {
        if (newUser.id && users.some((u) => u.id === newUser.id)) {
            setUsers(
                users.map((u) =>
                    u.id === newUser.id
                        ? ({
                            ...u,
                            ...newUser,
                            updated_at: new Date().toISOString(),
                        } as User)
                        : u
                )
            );
        } else {
            // Add new
            const id = uuidv4()
            const user_role_id = uuidv4()
            const userToAdd: User = {
                ...newUser,
                id,
                first_name: newUser.first_name || "",
                last_name: newUser.last_name || "",
                email: newUser.email || "",
                phone: newUser.phone || "",
                status: "ACTIVE",
                password: newUser.password || "123456",
                created_at: (new Date()).toString(),
                updated_at: (new Date()).toString(),
            };
            setUsers([userToAdd, ...users]);
            const newRole = roles
            // eslint-disable-next-line react-hooks/immutability
            newRole[id] = role
            setRoles(newRole)

            // api post
            const userRole: UserRole = { id: user_role_id, user_id: id, role_id: role == 'ADMIN' ? 2 : role == 'BUS_COMPANY' ? 3 : 1}
            authService.createUser(userToAdd, userRole)
        }
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

    const handleEdit = (id: string| number, user: User, role: string) => {
        authService.updateUser(id, user, role)
        setUsers(users.map(item => 
        {
            if(item.id == user.id){
                return user
            }
            return item
        }
        ))
        const newRoles = roles
        // eslint-disable-next-line react-hooks/immutability
        newRoles[user.id] = role
        setRoles(newRoles)
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
                setUsers(users.filter((u) => u.id !== user.id));
                authService.deleteUser(user.id ? user.id : '', user.id)
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
        authService.getAllUsers().then((res) => {
            setUsers(res)

            res.map((item) => {

                authService.getRoleUser(item.id).then((res) => {
                    res?.forEach((role) => {

                        setRoles((prevRoles) => {
                            if (prevRoles[item.id] == 'ADMIN') {
                                return prevRoles
                            }
                            if (prevRoles[item.id] == 'BUS_COMPANY' && role.role_name == 'ADMIN') {
                                return {
                                    ...prevRoles,
                                    [item.id]: role.role_name
                                }
                            }
                            return {
                                ...prevRoles,
                                [item.id]: role.role_name
                            }
                        }
                        )
                    })
                })

            })

        })

    }, [])

    
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

            <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <UserTable
                users={filteredUsers}
                roles={roles}
                onToggleStatus={handleToggleStatus}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
                user={selectedUser}
                statusForm={statusForm}
                Edit={handleEdit}
            />

            <ViewUserModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                user={selectedUser}
            />
        </div>
    );
}

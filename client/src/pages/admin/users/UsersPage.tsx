import { useState } from "react";
import Swal from "sweetalert2";
import UserHeader from "./components/UserHeader";
import UserSearch from "./components/UserSearch";
import UserTable from "./components/UserTable";
import AddUserModal from "./components/AddUserModal";
import ViewUserModal from "./components/ViewUserModal";

// Mock Data matching db.json structure
// Ensure mock data strictly follows User interface
export interface User {
  id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const initialUsers: User[] = [
  {
    user_id: 1,
    first_name: "Nguyễn",
    last_name: "Phát",
    email: "phat@gmail.com",
    phone: "0909123456",
    password: "123456",
    status: "ACTIVE",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    id: "8b0b",
  },
  {
    user_id: 2,
    first_name: "Admin",
    last_name: "System",
    email: "admin@gmail.com",
    phone: "0909000000",
    password: "Admin123",
    status: "ACTIVE",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    id: "33aa",
  },
  {
    id: "6222",
    first_name: "Hoàng",
    last_name: "Hải",
    email: "nguyentatho14106@gmail.com",
    password: "123123",
    phone: "0812719014",
    created_at: "2025-12-24T00:48:36.167Z",
    updated_at: "2025-12-24T00:48:36.167Z",
    status: "ACTIVE",
    user_id: 3,
  },
  {
    id: "af89",
    first_name: "Lê",
    last_name: "Lợi",
    email: "nguyendaiphat@gmail.com",
    password: "123123",
    phone: "0901298301",
    created_at: "2025-12-24T00:57:26.812Z",
    updated_at: "2025-12-24T00:57:26.812Z",
    status: "ACTIVE",
    user_id: 4,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            status: user.status === "ACTIVE" ? "LOCKED" : "ACTIVE",
          };
        }
        return user;
      })
    );
  };

  const handleAddUser = (newUser: Partial<User>) => {
    if (newUser.id && users.some((u) => u.id === newUser.id)) {
      // Edit existing
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
      const userToAdd: User = {
        ...newUser,
        user_id: users.length + 1,
        id: Date.now().toString(), // Mock ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Ensure required fields are present (mocking default values if missing from form)
        first_name: newUser.first_name || "",
        last_name: newUser.last_name || "",
        email: newUser.email || "",
        phone: newUser.phone || "",
        status: newUser.status || "ACTIVE",
        password: newUser.password || "123456", // Default password for new usage
      };
      setUsers([userToAdd, ...users]);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsAddModalOpen(true);
  };

  const handleViewClick = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
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
        setUsers(users.filter((u) => u.id !== user.id));
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
      user.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <UserHeader
        userCount={users.length}
        onAddClick={() => {
          setSelectedUser(null);
          setIsAddModalOpen(true);
        }}
      />

      <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <UserTable
        users={filteredUsers}
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
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}

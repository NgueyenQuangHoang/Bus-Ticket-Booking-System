import { useState } from "react";
import Swal from "sweetalert2";
import RoleHeader from "./components/RoleHeader";
import RoleTable from "./components/RoleTable";
import RoleFormModal from "./components/RoleFormModal";
import UserSearch from "../components/UserSearch";

export interface UserRole {
  id: number;
  userName: string;
  role: "ADMIN" | "USER" | "BUS_COMPANY";
}

const initialRoles: UserRole[] = [
  { id: 1, userName: "Nguyễn Phát", role: "USER" },
  { id: 2, userName: "Admin System", role: "ADMIN" },
  { id: 3, userName: "áljdf alsddf", role: "USER" },
  { id: 4, userName: "áljdf laf", role: "USER" },
  { id: 5, userName: "tho ákđ", role: "USER" },
  { id: 6, userName: "Nhà xe Minh", role: "BUS_COMPANY" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<UserRole[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa phân quyền này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa bỏ",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles(roles.filter((r) => r.id !== id));
        Swal.fire(
          "Đã xóa!",
          "Role assignment deleted successfully.",
          "success"
        );
      }
    });
  };

  const handleEdit = (role: UserRole) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleSave = (roleData: Omit<UserRole, "id"> | UserRole) => {
    if ("id" in roleData) {
      // Update
      setRoles(roles.map((r) => (r.id === roleData.id ? roleData : r)));
    } else {
      // Add
      const newId = Math.max(...roles.map((r) => r.id), 0) + 1;
      const newRole = { ...roleData, id: newId } as UserRole;
      setRoles([newRole, ...roles]);
    }
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <RoleHeader
        count={roles.length}
        onAddClick={() => {
          setSelectedRole(null);
          setIsModalOpen(true);
        }}
      />

      <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <RoleTable
        roles={filteredRoles}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <RoleFormModal
        key={selectedRole ? selectedRole.id : "new"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        role={selectedRole}
      />
    </div>
  );
}

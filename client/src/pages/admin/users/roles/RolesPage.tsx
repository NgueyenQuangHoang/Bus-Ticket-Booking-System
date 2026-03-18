import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import RoleHeader from "./components/RoleHeader";
import RoleTable from "./components/RoleTable";
import RoleFormModal from "./components/RoleFormModal";
import UserSearch from "../components/UserSearch";
import { authService } from "../../../../services/authService";
import api from "../../../../api/api";

export interface UserRole {
  id: string;
  userName: string;
  role: string;
  role_id: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: string; userName: string }[]>([]);
  const [availableRoles, setAvailableRoles] = useState<{ id: string; role_name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const fetchData = async () => {
    const [users, rolesData] = await Promise.all([
      authService.getAllUsers(),
      authService.getRoles(),
    ]);

    const userList = (users || []).map((u: any) => ({
      id: u.id,
      userName: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
    }));
    setAllUsers(userList);
    setAvailableRoles((rolesData as any) || []);

    const userRoles: UserRole[] = (users || [])
      .filter((u: any) => u.role_names)
      .map((u: any) => {
        const roleNames = (u.role_names as string).split(",");
        const roleIds = u.role_ids_list ? (u.role_ids_list as string).split(",") : [];
        return {
          id: u.id,
          userName: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
          role: roleNames[0] || "",
          role_id: roleIds[0] || "",
        };
      });
    setRoles(userRoles);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa phân quyền này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa bỏ",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.put(`/users/${id}/roles`, { role_ids: [] });
        setRoles((prev) => prev.filter((r) => r.id !== id));
        Swal.fire("Đã xóa!", "Phân quyền đã được xóa thành công.", "success");
      }
    });
  };

  const handleEdit = (role: UserRole) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleSave = async (data: UserRole) => {
    await api.put(`/users/${data.id}/roles`, { role_ids: [data.role_id] });
    setRoles((prev) => {
      const exists = prev.find((r) => r.id === data.id);
      if (exists) return prev.map((r) => (r.id === data.id ? data : r));
      return [data, ...prev];
    });
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
        allUsers={allUsers}
        availableRoles={availableRoles}
      />
    </div>
  );
}

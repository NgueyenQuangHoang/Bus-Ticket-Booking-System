import { useState } from "react";
import Swal from "sweetalert2";
import PermissionHeader from "./components/PermissionHeader";
import PermissionTable from "./components/PermissionTable";
import PermissionFormModal from "./components/PermissionFormModal";
import UserSearch from "../components/UserSearch";

export interface Permission {
  id: number;
  name: string;
  description: string;
}

const initialPermissions: Permission[] = [
  { id: 1, name: "ADMIN", description: "Quản trị viên hệ thống" },
  { id: 2, name: "USER", description: "Người dùng thông thường" },
  { id: 3, name: "BUS_COMPANY", description: "Nhà xe" },
];

export default function UserPermissionsPage() {
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa quyền này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        setPermissions(permissions.filter((p) => p.id !== id));
        Swal.fire('Đã xóa!', 'Quyền đã được xóa thành công.', 'success');
      }
    });
  };

  const handleEdit = (permission: Permission) => {
      setSelectedPermission(permission);
      setIsModalOpen(true);
  };

  const handleSave = (permissionData: Omit<Permission, 'id'> | Permission) => {
      if ('id' in permissionData) {
          // Update
          setPermissions(permissions.map(p => p.id === permissionData.id ? permissionData : p));
      } else {
          // Add
          const newId = Math.max(...permissions.map(p => p.id), 0) + 1;
          const newPermission = { ...permissionData, id: newId } as Permission;
          setPermissions([newPermission, ...permissions]);
      }
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PermissionHeader 
        count={permissions.length} 
        onAddClick={() => {
            setSelectedPermission(null);
            setIsModalOpen(true);
        }}
      />

      <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <PermissionTable
        permissions={filteredPermissions}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <PermissionFormModal
        key={selectedPermission ? selectedPermission.id : 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        permission={selectedPermission}
      />
    </div>
  );
}

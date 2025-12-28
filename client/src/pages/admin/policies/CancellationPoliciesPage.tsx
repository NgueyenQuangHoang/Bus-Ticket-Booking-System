import { useState } from 'react';
import Swal from 'sweetalert2';
import PolicyHeader from './components/PolicyHeader';
import PolicyTable, { type Policy } from './components/PolicyTable';
import PolicyFormModal from './components/PolicyFormModal';
import UserSearch from '../users/components/UserSearch';

const MOCK_POLICIES: Policy[] = [
  { id: 1, route_name: "Bến xe Miền Đông → Bến xe Mỹ Đình", time_limit: 1440, refund_percent: 100 },
  { id: 2, route_name: "Bến xe Miền Đông → Bến xe Mỹ Đình", time_limit: 720, refund_percent: 70 },
  { id: 3, route_name: "Bến xe Miền Đông → Bến xe Giáp Bát", time_limit: 720, refund_percent: 80 },
  { id: 4, route_name: "Bến xe Miền Đông → Bến xe Giáp Bát", time_limit: 360, refund_percent: 50 },
  { id: 5, route_name: "Bến xe Miền Tây → Bến xe Mỹ Đình", time_limit: 1440, refund_percent: 90 },
];

export default function CancellationPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  // Filter & Pagination
  const filteredPolicies = policies.filter((p) =>
    p.route_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const currentPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAdd = () => {
    setEditingPolicy(null);
    setIsModalOpen(true);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setIsModalOpen(true);
  };

  const handleDelete = (policy: Policy) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        setPolicies(prev => prev.filter(p => p.id !== policy.id));
        Swal.fire(
          'Đã xóa!',
          'Chính sách đã được xóa thành công.',
          'success'
        );
      }
    });
  };

  const handleSave = (policyData: Omit<Policy, 'id'> | Policy) => {
    if ('id' in policyData) {
      // Update
      setPolicies(prev => prev.map(p => p.id === policyData.id ? policyData : p));
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Create
      const newPolicy: Policy = {
        ...policyData,
        id: Math.max(...policies.map(p => p.id), 0) + 1
      };
      setPolicies(prev => [newPolicy, ...prev]);
      Swal.fire({
        icon: 'success',
        title: 'Thêm mới thành công',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div>
      <PolicyHeader count={policies.length} onAdd={handleAdd} />
      
      <div className="mb-6">
         <UserSearch 
            searchTerm={searchTerm} 
            onSearchChange={(term) => {
                setSearchTerm(term);
                setCurrentPage(1);
            }} 
         />
      </div>

      <PolicyTable 
        policies={currentPolicies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredPolicies.length}
      />

      <PolicyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        policy={editingPolicy}
      />
    </div>
  );
}

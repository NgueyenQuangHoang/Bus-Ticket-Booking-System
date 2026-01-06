import { useState } from "react";
import Swal from "sweetalert2";
import PaymentGatewayHeader from "./components/PaymentGatewayHeader";
import PaymentGatewayTable from "./components/PaymentGatewayTable";
import PaymentGatewayFormModal from "./components/PaymentGatewayFormModal";
import UserSearch from "../../users/components/UserSearch";

export interface PaymentProvider {
    payment_provider_id: number;
    provider_name: string;
    provider_type: string;
    api_endpoint: string;
    id: string;
}

const initialPayments: PaymentProvider[] = [
  {
    payment_provider_id: 1,
    provider_name: "VNPay",
    provider_type: "GATEWAY",
    api_endpoint: "https://vnpay.vn/api",
    id: "dd6a"
  },
  {
      payment_provider_id: 2,
      provider_name: "MoMo",
      provider_type: "WALLET",
      api_endpoint: "https://momo.vn/api",
      id: "mm1b"
  },
   {
      payment_provider_id: 3,
      provider_name: "ZaloPay",
      provider_type: "WALLET",
      api_endpoint: "https://zalopay.vn/api",
      id: "zl2c"
  }
];

export default function PaymentGatewaysPage() {
  const [payments, setPayments] = useState<PaymentProvider[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentProvider | null>(null);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc chắn muốn xóa cổng thanh toán này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        setPayments(payments.filter((p) => p.payment_provider_id !== id));
        Swal.fire('Đã xóa!', 'Cổng thanh toán đã được xóa thành công.', 'success');
      }
    });
  };

  const handleEdit = (payment: PaymentProvider) => {
      setSelectedPayment(payment);
      setIsModalOpen(true);
  };

  const handleSave = (paymentData: Omit<PaymentProvider, 'payment_provider_id'> | PaymentProvider) => {
      if ('payment_provider_id' in paymentData) {
          // Update
          setPayments(payments.map(p => p.payment_provider_id === paymentData.payment_provider_id ? paymentData : p));
      } else {
          // Add
          const newId = (payments.length > 0 ? Math.max(...payments.map(p => p.payment_provider_id)) : 0) + 1;
          const newPayment = { ...paymentData, payment_provider_id: newId } as PaymentProvider;
          setPayments([newPayment, ...payments]);
      }
      setIsModalOpen(false); 
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Lưu cổng thanh toán thành công!',
        timer: 1500,
        showConfirmButton: false
      });
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.provider_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PaymentGatewayHeader 
        count={payments.length} 
        onAddClick={() => {
            setSelectedPayment(null);
            setIsModalOpen(true);
        }}
      />

      <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <PaymentGatewayTable
        payments={filteredPayments}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <PaymentGatewayFormModal
        key={selectedPayment ? selectedPayment.payment_provider_id : 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        payment={selectedPayment}
      />
    </div>
  );
}

import { useState } from "react";
import TransactionHeader from "./components/TransactionHeader";
import TransactionTable, { type Transaction } from "./components/TransactionTable";
import TransactionFilters from "./components/TransactionFilters";
import TransactionDetailModal from "./components/TransactionDetailModal";
import UserSearch from "../../users/components/UserSearch";

const mockTransactions: Transaction[] = [
  {
    payment_id: 1,
    ticket_id: 1,
    user_id: 1,
    payment_provider_id: 1,
    payment_method: "ONLINE",
    amount: 200000,
    transaction_code: "TXN00000001",
    status: "COMPLETED",
    paid_at: "2025-12-17T10:30",
    created_at: "2025-12-17",
    updated_at: "2025-12-17",
    id: "3ec1"
  },
  {
      payment_id: 2,
      ticket_id: 2,
      user_id: 2,
      payment_provider_id: 2,
      payment_method: "ONLINE",
      amount: 250000,
      transaction_code: "TXN00000002",
      status: "PENDING",
      paid_at: "2025-12-22T14:15",
      created_at: "2025-12-22",
      updated_at: "2025-12-22",
      id: "3ec2"
  },
   {
      payment_id: 3,
      ticket_id: 3,
      user_id: 3,
      payment_provider_id: 3,
      payment_method: "ONLINE",
      amount: 300000,
      transaction_code: "TXN00000003",
      status: "FAILED",
      paid_at: "2025-12-07T09:00",
      created_at: "2025-12-07",
      updated_at: "2025-12-07",
      id: "3ec3"
  },
  {
      payment_id: 4,
      ticket_id: 4,
      user_id: 4,
      payment_provider_id: 1,
      payment_method: "ONLINE",
      amount: 350000,
      transaction_code: "TXN00000004",
      status: "REFUNDED",
      paid_at: "2025-12-18T16:45",
      created_at: "2025-12-18",
      updated_at: "2025-12-18",
      id: "3ec4"
  },
  {
      payment_id: 5,
      ticket_id: 5,
      user_id: 5,
      payment_provider_id: 2,
      payment_method: "ONLINE",
      amount: 400000,
      transaction_code: "TXN00000005",
      status: "COMPLETED",
      paid_at: "2025-12-13T11:20",
      created_at: "2025-12-13",
      updated_at: "2025-12-13",
      id: "3ec5"
  },
   {
      payment_id: 6,
      ticket_id: 6,
      user_id: 6,
      payment_provider_id: 3,
      payment_method: "ONLINE",
      amount: 450000,
      transaction_code: "TXN00000006",
      status: "PENDING",
      paid_at: "2025-12-12T08:30",
      created_at: "2025-12-12",
      updated_at: "2025-12-12",
      id: "3ec6"
  },
  {
      payment_id: 7,
      ticket_id: 7,
      user_id: 7,
      payment_provider_id: 1,
      payment_method: "ONLINE",
      amount: 500000,
      transaction_code: "TXN00000007",
      status: "FAILED",
      paid_at: "2025-12-04T13:40",
      created_at: "2025-12-04",
      updated_at: "2025-12-04",
      id: "3ec7"
  }
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleExport = () => {
    // Implement export functionality
    alert("Đang phát triển");
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.transaction_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = currentFilter === 'ALL' || t.status === currentFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <TransactionHeader count={transactions.length} onExport={handleExport} />
      
      <TransactionFilters 
        currentFilter={currentFilter} 
        onFilterChange={(filter) => {
            setCurrentFilter(filter);
            setCurrentPage(1);
        }} 
      />

      <UserSearch searchTerm={searchTerm} onSearchChange={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
      }} />

      <TransactionTable 
        transactions={currentTransactions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredTransactions.length}
        onViewDetail={(t) => {
            setSelectedTransaction(t);
            setIsModalOpen(true);
        }}
      />

      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}

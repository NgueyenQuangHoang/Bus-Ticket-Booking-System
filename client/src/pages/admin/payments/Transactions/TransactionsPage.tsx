import { useState, useEffect } from "react";
import TransactionHeader from "./components/TransactionHeader";
import TransactionTable, { type Transaction } from "./components/TransactionTable";
import TransactionFilters from "./components/TransactionFilters";
import TransactionDetailModal from "./components/TransactionDetailModal";
import UserSearch from "../../users/components/UserSearch";
import { paymentService } from "../../../../services/paymentService";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
        const { data, total } = await paymentService.getAllPayments(currentPage, itemsPerPage, searchTerm, currentFilter);
        
        const mappedData: Transaction[] = data.map((p) => ({
            id: p.id,
            transaction_code: p.id.replace('PAY_', ''), // Helper for better display if needed, or just p.id
            payment_id: p.id,
            ticket_id: p.ticket_id,
            ticket_code: (p.ticket as any)?.code, // Map ticket code safely
            user_id: p.ticket?.user_id || 'N/A',
            payment_provider_id: p.method === 'QR_PAYMENT' ? 1 : (p.method === 'E_WALLET' ? 2 : 3), // Simple mapping based on method string
            payment_method: p.method,
            amount: p.amount,
            status: p.status,
            paid_at: p.transaction_date,
            created_at: p.transaction_date, // Using same date for now
            updated_at: p.transaction_date,
            provider_name: p.method === 'QR_PAYMENT' ? 'VNPay (QR)' : p.method // Basic display mapping
        }));

        setTransactions(mappedData);
        setTotalItems(total);
    } catch (error) {
        console.error("Failed to fetch transactions", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm, currentFilter]);

  const handleExport = () => {
    // Implement export functionality
    alert("Đang phát triển");
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // Filtering and pagination is now handled by the API (or manually if API doesn't support all)
  // Since our service passes search and page, we rely on `transactions` being the current page data.
  const currentTransactions = transactions; 


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

      <UserSearch 
          inputData={searchTerm} 
          setInputData={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }} 
      />

      {loading ? (
        <div className="text-center py-4">Đang tải dữ liệu...</div>
      ) : (
        <TransactionTable 
            transactions={currentTransactions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            onViewDetail={(t) => {
                setSelectedTransaction(t);
                setIsModalOpen(true);
            }}
        />
      )}

      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}

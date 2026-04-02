'use client';
import AppShell from '../../components/layout/AppShell';
import TransactionTable from '../../components/transactions/TransactionTable';

export default function TransactionsPage() {
  return (
    <AppShell title="Transactions" subtitle="Search, filter and manage all entries">
      <div className="max-w-7xl mx-auto">
        <TransactionTable />
      </div>
    </AppShell>
  );
}

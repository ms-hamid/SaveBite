import AdminLayout from "@/components/admin/AdminLayout";
import RefundDetailClient from "@/components/admin/refund/RefundDetailClient";

export default function AdminRefundDetailPage() {
  return (
    <AdminLayout activeMenu="refund-management">
      <RefundDetailClient />
    </AdminLayout>
  );
}

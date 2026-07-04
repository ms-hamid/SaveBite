import AdminLayout from "@/components/admin/AdminLayout";
import RefundManagementClient from "@/components/admin/refund/RefundManagementClient";

export default function AdminRefundPage() {
  return (
    <AdminLayout activeMenu="refund-management">
      <RefundManagementClient />
    </AdminLayout>
  );
}

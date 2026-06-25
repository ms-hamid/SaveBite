import AdminLayout from "../../../components/admin/AdminLayout";
import PayoutManagementClient from "../../../components/admin/payout/PayoutManagementClient";

export default function Page() {
  return (
    <AdminLayout>
      <PayoutManagementClient />
    </AdminLayout>
  );
}

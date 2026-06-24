import AdminLayout from "../../../components/admin/AdminLayout";
import MerchantManagementClient from "../../../components/admin/merchant/MerchantManagementClient";


export default function Page() {
  return (
    <AdminLayout>
      <MerchantManagementClient />
    </AdminLayout>
  );
}
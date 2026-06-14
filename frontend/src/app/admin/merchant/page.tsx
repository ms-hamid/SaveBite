import AdminLayout from "../../../components/admin/AdminLayout";
import MerchantManagementClient from "../../../components/admin/merchant/MerchantManagementClient";

export const metadata = {
  title: "SaveBite Admin - Merchant Management",
};

export default function Page() {
  return (
    <AdminLayout>
      <MerchantManagementClient />
    </AdminLayout>
  );
}
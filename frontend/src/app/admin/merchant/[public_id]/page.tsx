import AdminLayout from "../../../../components/admin/AdminLayout";
import MerchantDetailClient from "../../../../components/admin/merchant/MerchantDetailClient";

export const metadata = {
  title: "SaveBite Admin - Merchant Detail",
};

export default function Page() {
  return (
    <AdminLayout>
      <MerchantDetailClient />
    </AdminLayout>
  );
}
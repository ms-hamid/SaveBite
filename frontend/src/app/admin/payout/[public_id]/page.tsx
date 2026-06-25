import AdminLayout from "../../../../components/admin/AdminLayout";
import PayoutDetailClient from "../../../../components/admin/payout/PayoutDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;

  return (
    <AdminLayout>
      <PayoutDetailClient withdrawalId={public_id} />
    </AdminLayout>
  );
}

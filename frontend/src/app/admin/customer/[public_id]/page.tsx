"use client";
import { useParams } from "next/navigation";
import AdminLayout from "../../../../components/admin/AdminLayout";
import CustomerDetailClient from "../../../../components/admin/CustomerDetailClient";



export default async function Page() {
  const params = useParams();

  return (
    <AdminLayout>
      <CustomerDetailClient public_id={params.public_id} />
    </AdminLayout>
  );
}
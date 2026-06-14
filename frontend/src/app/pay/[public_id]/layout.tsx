import React from "react";
import { OrderProvider } from "../../../components/providers/OrderProvider";
import { PaymentProvider } from "../../../components/providers/PaymentProvider";

export default async function PaymentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;

  return ( 
    // masalah di kode ini yaitu pada payment provider itu mengambil params yang merupakan public_id dari order jadinya gak bakalan dapat payment yang bener kakrena id nya masih menggunakan id number 
    <PaymentProvider order_id={public_id}>
      {children}
    </PaymentProvider>
  );
}1
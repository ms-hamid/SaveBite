import React from "react";
import { OrderProvider } from "../../../components/providers/OrderProvider";

export default async function HistoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;

  return <OrderProvider order_id={public_id}>{children}</OrderProvider>;
}
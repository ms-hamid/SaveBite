"use client"
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default  function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
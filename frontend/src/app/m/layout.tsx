"use client"
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "MERCHANT") {
        // ganti ke push unauthenticated
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
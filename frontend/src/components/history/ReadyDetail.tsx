"use client";

import { useState } from "react";
import OrderReadyNormal from "../order_ready/NormalPage";
import PaymentConfirmedPage from "../order_ready/QRPage";

export function OrderDetailReadyStateScreen() {
  const [page_state, set_page_state] = useState<"qr" | "normal">("normal");
   
  return (
    <>
    {page_state === "normal" ? <OrderReadyNormal set_page_state={set_page_state} /> : <PaymentConfirmedPage/>}
      
    </>
  );
}


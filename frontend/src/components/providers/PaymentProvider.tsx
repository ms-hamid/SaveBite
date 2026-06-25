"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../../lib/supabase";
import { format_price } from "../../app/home/page";
import { Formatted, Order, Payment } from "../../types";
import { getOrderByPublicId } from "@/services/order";

type PaymentContextType = {
  payment: Payment | undefined | null;
  order: Order | undefined | null;
  setOrder: React.Dispatch<React.SetStateAction<Order | undefined | null>>
  setPayment: React.Dispatch<React.SetStateAction<Payment | undefined | null>>;
  isLoading: boolean;
  refetchPayment: () => Promise<void>;
};

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({
  children,
  order_id,
}: {
  children: React.ReactNode;
  order_id: string ;
}) {
  const [payment, setPayment] = useState<Payment | null>();
  const [order, setOrder] = useState<Order | null>();
  const [isLoading, setIsLoading] = useState(true);

  async function refetchPayment() {
    try {
      setIsLoading(true);

      if (!order_id) {
        console.error("Invalid order_id:", order_id);
        setPayment(undefined);
        return;
      }


      // if (Number.isNaN(parsedOrderId)) {
      //   console.error("order_id must be a valid number:", order_id);
      //   setPayment(undefined);
      //   return;
      // }

      const res = await getOrderByPublicId(order_id);
      const data = res.data;
      if (!data) {
        setPayment(undefined);
        return;
      }

        const formatted_data = {
          "total_amount" : format_price(data.total_amount),
          "ori_price" : format_price(data.listing?.original_price),
          "dis_price" : format_price(data.listing?.discount_price),
          "price_diff" : format_price((data.listing?.original_price ?? 0) - (data.listing?.discount_price ?? 0)),
          "saved_price" : ""
        }; 
  
      
      const saved_price = ((data.listing?.original_price ?? 0 )- (data.listing?.discount_price ?? 0)) * (order?.qty ?? 1)
      if (saved_price !== 0) formatted_data["saved_price"] = format_price(saved_price);

      data.formatted = formatted_data;

      setPayment(data.payment);
      setOrder(data)
    } catch (error) {
      console.error("Unexpected error while fetching payment:", error);
      setPayment(undefined);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refetchPayment();
  }, [order_id]);

  return (
    <PaymentContext.Provider
      value={{
        payment,
        order, 
        setOrder,
        setPayment,
        isLoading,
        refetchPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error("usePayment must be used inside PaymentProvider");
  }

  return context;
}
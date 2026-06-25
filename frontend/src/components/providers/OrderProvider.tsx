"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Sesuaikan path supabase client kamu
import { supabase } from "../../lib/supabase";
import { format_price } from "../../app/home/page";
import { Formatted, Listing, Merchant, Order, Payment } from "../../types";
import { getOrderByPublicId } from "@/services/order";


type OrderContextType = {
  order: Order | undefined | null;
  setOrder: React.Dispatch<React.SetStateAction<Order | undefined | null>> | undefined;
  listing: Listing | undefined | null;
  setListing: React.Dispatch<React.SetStateAction<Listing | undefined | null>> | undefined;
  merchant: Merchant | undefined | null;
  setMerchant: React.Dispatch<React.SetStateAction<Merchant | undefined | null>> | undefined;
  payment: Payment | undefined | null;
  setPayment: React.Dispatch<React.SetStateAction<Payment | undefined | null>> | undefined;
  isLoading: boolean;
  refetchOrder: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({
  children,
  order_id,
}: {
  children: React.ReactNode;
  order_id: string;
}) {
  const [order, setOrder] = useState<Order | null>();
  const [payment, setPayment] = useState<Payment | null>();
  const [merchant, setMerchant] = useState<Merchant | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState<Listing | null>()
  async function refetchOrder() {
    try {
      setIsLoading(true);


      if (!order_id) {
        console.error("Invalid order_id:", order_id);
        setOrder(undefined);
        return;
      }

      const data = (await getOrderByPublicId(order_id)).data;

      
      data.total_amount = Number(data.total_amount)
      data.listing.original_price = Number(data.listing?.original_price)
      data.listing.discount_price = Number(data.listing?.discount_price)
      

      const formatted_data = {
        "total_amount" : format_price(data.total_amount),
        "ori_price" : format_price(data.listing?.original_price),
        "dis_price" : format_price(data.listing?.discount_price),
        "price_diff" : format_price((data.listing?.original_price ?? 0) - (data.listing?.discount_price ?? 0)),
        "saved_price" : ""
      }; 

      const saved_price = ((data.listing?.original_price ?? 0) - (data.listing?.discount_price ?? 0)) * (order?.qty || 1)
      if (saved_price !== 0) formatted_data["saved_price"] = format_price(saved_price);
      
      setListing(data?.listing)
      setMerchant(data?.merchant)
      setPayment(data?.payment)
      
      data.formatted = formatted_data;
      setOrder(data);
    
    } catch (error) {
      console.error("Unexpected error while fetching order:", error);
      setOrder(undefined);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refetchOrder();
  }, [order_id]);

  return (
    <OrderContext.Provider
      value={{
        order,
        setOrder,
        listing,
        setListing,
        merchant,
        setMerchant,
        payment,
        setPayment,
        isLoading,
        refetchOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }

  return context;
}
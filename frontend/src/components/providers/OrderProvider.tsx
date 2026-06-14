"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Sesuaikan path supabase client kamu
import { supabase } from "../../lib/supabase";
import { format_price } from "../../app/page";
import { Formatted, Listing, Merchant, Order } from "../../types";


type OrderContextType = {
  order: Order | undefined | null;
  setOrder: React.Dispatch<React.SetStateAction<Order | undefined | null>> | undefined;
  listing: Listing | undefined | null;
  setListing: React.Dispatch<React.SetStateAction<Listing | undefined | null>> | undefined;
  merchant: Merchant | undefined | null;
  setMerchant: React.Dispatch<React.SetStateAction<Merchant | undefined | null>> | undefined;

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
  // const [payment, setPayment] = useState<Payment>();
  const [merchant, setMerchant] = useState<Merchant | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState<Listing | null>()
  async function refetchOrder() {
    try {
      setIsLoading(true);

      console.log(order_id)

      if (!order_id) {
        console.error("Invalid order_id:", order_id);
        setOrder(undefined);
        return;
      }

      const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        qty,
        total_amount,
        qr_token,
        status,
        created_at,
        updated_at,
        deleted_at,
        listing_id,
        customer_id,
        order_code,
        order_code_expires_at,
        order_code_active,
        public_id,
        listings:listing_id (
          name,
          description,
          discount_price,
          discount_percentage,
          original_price,
          merchant_id,
          img_url,  
          merchants:merchant_id (
            merchant_name,
            address,
            profile_pic
          )
        )
      `).eq("public_id", order_id).single().returns<Order & {formatted: Formatted}>();
    
      if (error) {
        console.log(error);
        return;
      }
      
      console.log(data);

      if (error) {
        console.error("Failed to fetch order:", error);
        setOrder(undefined);
        return;
      }
      
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
      setMerchant(data?.listing?.merchant)
      
      data.formatted = formatted_data;
      console.log(data)
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
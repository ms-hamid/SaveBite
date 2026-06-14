"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";
import { Customer } from "../../types";

type CustomerContextType = {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  fetchCustomer: () => Promise<void>;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setCustomer(null);
        return;
      }

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      setCustomer(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengambil data customer";

      setError(message);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        error,
        fetchCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomer harus digunakan di dalam CustomerProvider");
  }

  return context;
}
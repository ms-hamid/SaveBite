import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { format_price, get_close_text, set_to_hour } from "../../app/page";
import { Listing } from "../../types";


type ListingContextType = {
    listing: Listing | null | undefined,
    set_listing: React.Dispatch<React.SetStateAction<Listing | null | undefined>>;
    is_loading: boolean;
    refetch_listing: () => Promise<void>;
}

const listing_context = createContext<ListingContextType | null>(null);

export function ListingProvider({children, public_id} : {children: React.ReactNode, public_id: string}) {
    const [listing, set_listing] = useState<Listing | null | undefined>(null)
    const [is_loading, set_is_loading] = useState(true);

    async function refetch_listing() {
        try {
            set_is_loading(true);

            const { data, error } = await supabase.from("listings").select("*, merchants (merchant_name) ").eq("public_id", public_id).single();
            if (error) {
                console.log(error)
                return;
            }

            const others_data = {
                formatted_original_price: format_price(data.original_price),
                formatted_discount_price: format_price(data.discount_price),
                formatted_price_diff:format_price(data.original_price - data.discount_price),
                ended_time: get_close_text(data.close_time),
                stock_left: data.stock_total - data.sold_total
            }


            console.log(data.stock_total - data.sold_total)
            data["others"] = others_data

            console.log("ini data dari provider");
            console.log(data);

            set_listing(data);
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        refetch_listing();
    }, [public_id]);

    return (
        <listing_context.Provider value={{
            listing,
            is_loading,
            refetch_listing,
            set_listing
        }}>
            <>{children}</>
        </listing_context.Provider>
    )
}

export function useListing() {
    const context = useContext(listing_context);

    if (!context) {
        throw new Error("useListing must be used inside ListingProvider");
    }

    return context;
}
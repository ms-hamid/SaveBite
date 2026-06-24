import { createContext, useContext, useEffect, useState } from "react";
import { format_price, get_close_text, set_to_hour } from "../../app/home/page";
import { Formatted, Listing } from "../../types";
import { getListingByPublicID } from "@/services/listing";


type ListingContextType = {
    listing: Listing & {others: Formatted} | null | undefined,
    set_listing: React.Dispatch<React.SetStateAction<Listing & {others: Formatted} | null | undefined>>;
    is_loading: boolean;
    refetch_listing: () => Promise<void>;
}

const listing_context = createContext<ListingContextType | null>(null);

export function ListingProvider({children, public_id} : {children: React.ReactNode, public_id: string}) {
    const [listing, set_listing] = useState<Listing & {others: Formatted} | null | undefined>(null)
    const [is_loading, set_is_loading] = useState(true);

    async function refetch_listing() {
        try {
            set_is_loading(true);

            const data = (await getListingByPublicID(public_id)).data
            console.log("price: ", data.original_price)
            const others_data = {
                ori_price: format_price(data.original_price),
                dis_price: format_price(data.discount_price),
                price_diff: format_price(data.original_price - data.discount_price)
            }
            // console.log(data.stock_total - data.sold_total)
            data["others"] = others_data

            console.log("ini data dari provider");
            console.log(data);

            set_listing(data);
        } catch(error) {
            console.log(error);
        } finally {
            set_is_loading(false)
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
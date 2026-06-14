"use client";

import { useParams } from "next/navigation";
import { ListingProvider } from "../../../components/providers/ListingProvider";

export default function ListingLayout({children} : {children: React.ReactNode}) {
    const params = useParams<{public_id: string}>();
    return <ListingProvider public_id={params.public_id}> {children} </ListingProvider>
}
import {JobLevel} from "@prisma/client";

export interface OfferAcceptDto {
    customerId: string
    offerId: string
    levels: JobLevel[]
    pinned?: string
}
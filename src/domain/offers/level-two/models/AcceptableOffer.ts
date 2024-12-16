import {ArrayElement} from "@/common/utils/types";
import offerService from "@/domain/offers/shared/services/OfferService";
import {JobLevel} from "@prisma/client";

export interface AcceptableOffer extends ArrayElement<Awaited<ReturnType<typeof offerService.getAllForLevel2>>> {
    accepted: boolean,
    pinned?: boolean,
    acceptedFor?: JobLevel[]
}

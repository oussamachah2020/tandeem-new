import {OfferCreateDto, OfferCreateFilesDto} from "@/domain/offers/shared/dtos/OfferCreateDto";

export interface OfferUpdateDto extends Omit<OfferCreateDto, 'paymentDetails'> {
    offerId: string
    imageRef: string
    couponRef: string
    paymentDetails?: string
}

export type OfferUpdateFilesDto = Partial<OfferCreateFilesDto>
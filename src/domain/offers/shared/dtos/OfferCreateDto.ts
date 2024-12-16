import {Blob} from 'buffer'
import {SubCategory, SubPaymentMethod} from "@prisma/client";

export interface OfferCreateDto {
    contractorId: string
    title: string
    description: string
    category: SubCategory
    subPaymentMethod: SubPaymentMethod
    from: string
    to: string
    discount?: string
    initialPrice?: string
    finalPrice?: string
    paymentDetails: string
}

export interface OfferCreateFilesDto {
    image: Blob
    coupon?: Blob
}

export interface PromoCodeOnePaymentDetails {
    code: string
    usageLimit: number,
    used: number
}

export interface PromoCodeMultiplePaymentDetails {
    codes: string[]
    usedCodes: string[]
}

export interface CouponPaymentDetails {
    couponRef: string
    data?: any
}

export interface NAPaymentDetails {
    description: string
}


import {NextApiRequest, NextApiResponse} from 'next'
import prisma from "@/common/libs/prisma";
import {SubPaymentMethod} from "@prisma/client";
import {constants} from "http2";
import {
    CouponPaymentDetails,
    PromoCodeMultiplePaymentDetails,
    PromoCodeOnePaymentDetails
} from "@/domain/offers/shared/dtos/OfferCreateDto";


interface TypedNextApiRequest extends NextApiRequest {
    body: { employeeId: string, offerId: string }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {employeeId, offerId} = req.body
    const employeeConsumedOffer = await prisma.employeeConsumedOffers.findUnique({
        where: {
            employeeId_offerId: {
                employeeId,
                offerId
            }
        },
        include: {offer: true}
    })
    if (!employeeConsumedOffer) {
        const newEmployeeConsumedOffer = await prisma.employeeConsumedOffers.create({
            data: {offerId, employeeId},
            include: {offer: true}
        })
        const {offer: {id, subPaymentMethod, paymentDetails}} = newEmployeeConsumedOffer
        if (subPaymentMethod === SubPaymentMethod.PromoCode_OneCode) {
            const payment = paymentDetails as any as PromoCodeOnePaymentDetails
            if (payment.used < payment.usageLimit) {
                const code = payment.code
                await prisma.offer.update({
                    where: {id},
                    data: {
                        paymentDetails: {...payment, used: payment.used + 1} as any
                    }
                })
                res.json({details: code, method: "PromoCode"})
                return
            }
        } else if (subPaymentMethod === SubPaymentMethod.PromoCode_MultipleCodes) {
            const payment = paymentDetails as any as PromoCodeMultiplePaymentDetails
            const unusedCodes = payment.codes.filter(code => !payment.usedCodes.includes(code)) ?? []
            if (unusedCodes.length) {
                const code = unusedCodes.pop()!
                payment.usedCodes.push(code)
                await prisma.offer.update({where: {id}, data: {paymentDetails: {...payment} as any}})
                res.json({details: code, method: "PromoCode"})
                return
            }
        } else if (subPaymentMethod === SubPaymentMethod.Coupon_Generated || subPaymentMethod === SubPaymentMethod.Coupon_Pregenerated) {
            const {couponRef} = paymentDetails as any as CouponPaymentDetails
            res.json({details: couponRef, method: "Coupon"})
            return
        }
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    } else {
        res.status(constants.HTTP_STATUS_FORBIDDEN).end()
    }
}
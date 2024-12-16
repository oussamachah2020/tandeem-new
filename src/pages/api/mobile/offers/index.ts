import {NextApiRequest, NextApiResponse} from 'next'
import prisma from "@/common/libs/prisma";
import {Category, OfferStatusName, Prisma, SubCategory} from "@prisma/client";
import {constants} from "http2";
import SortOrder = Prisma.SortOrder;
import staticValues from "@/common/context/StaticValues";


interface TypedNextApiRequest extends NextApiRequest {
    query: {
        id: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {id} = req.query
    const employee = await prisma.employee.findUnique({where: {id}})
    if (employee) {
        const tandeemOffers = await prisma.acceptedOffer.findMany({
            where: {
                customer: {id: employee.customerId},
                for: {has: employee.level},
                offer: {status: OfferStatusName.Active}
            },
            select: {
                offer: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        category: true,
                        image: true,
                        initialPrice: true,
                        finalPrice: true,
                        discount: true,
                        to: true,
                        partner: {
                            select: {
                                id: true,
                                name: true,
                                address: true,
                                logo: true,
                                website: true,
                                category: true
                            }
                        },
                        createdAt: true,
                    }
                },
                pinned: true,
            },
            orderBy: [
                {pinned: SortOrder.desc},
                {offer: {createdAt: SortOrder.desc}}
            ]
        })
        const customerOffers = await prisma.offer.findMany({
            where: {
                customerId: employee.customerId,
                status: OfferStatusName.Active
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                image: true,
                to: true,
                initialPrice: true,
                finalPrice: true,
                discount: true,
                createdAt: true,
                paymentDetails: true
            },
            orderBy: {createdAt: SortOrder.desc}
        })
        res.json({
            tandeem: tandeemOffers.map(result => ({
                ...result.offer,
                category: staticValues.subCategory[result.offer.category as keyof typeof SubCategory],
                partner: {
                    ...result.offer.partner,
                    category: staticValues.category[result.offer.partner?.category as keyof typeof Category]
                },
                pinned: result.pinned
            })),
            customer: customerOffers.map(result => ({
                ...result,
                category: staticValues.subCategory[result.category as keyof typeof SubCategory]
            }))
        })
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
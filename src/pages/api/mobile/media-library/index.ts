import {NextApiRequest, NextApiResponse} from 'next'
import prisma from "@/common/libs/prisma";
import {Prisma} from "@prisma/client";
import {constants} from "http2";
import SortOrder = Prisma.SortOrder;


interface TypedNextApiRequest extends NextApiRequest {
    query: {
        id: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {id} = req.query
    const employee = await prisma.employee.findUnique({where: {id}})
    if (employee) {
        const tandeemMedia = await prisma.mediaLibrary.findMany({
            where: {customer: {is: null}},
            select: {
                id: true,
                title: true,
                description: true,
                url: true,
                createdAt: true
            },
            orderBy: [{createdAt: SortOrder.desc}]
        })
        const customerMedia = await prisma.mediaLibrary.findMany({
            where: {customerId: employee.customerId,},
            select: {
                id: true,
                title: true,
                description: true,
                url: true,
                createdAt: true,
            },
            orderBy: [{createdAt: SortOrder.desc}]
        })
        res.json({
            tandeem: tandeemMedia,
            customer: customerMedia
        })
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
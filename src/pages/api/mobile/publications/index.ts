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
        const tandeemPublications = await prisma.publication.findMany({
            where: {customer: {is: null}},
            select: {
                id: true,
                title: true,
                content: true,
                photo: true,
                pinned: true,
                createdAt: true,
            },
            orderBy: [
                {createdAt: SortOrder.desc},
                {pinned: SortOrder.desc}
            ]
        })
        const customerPublications = await prisma.publication.findMany({
            where: {customerId: employee.customerId,},
            select: {
                id: true,
                title: true,
                content: true,
                photo: true,
                pinned: true,
                createdAt: true,
            },
            orderBy: [
                {createdAt: SortOrder.desc},
                {pinned: SortOrder.desc}
            ]
        })
        res.json({
            tandeem: tandeemPublications,
            customer: customerPublications
        })
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
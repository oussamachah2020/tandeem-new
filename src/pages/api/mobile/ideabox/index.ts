import {NextApiRequest, NextApiResponse} from 'next'
import prisma from "@/common/libs/prisma";
import {constants} from "http2";
import { Prisma } from "@prisma/client";
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
        const ideas = await prisma.ideaBox.findMany({
            where: {employeeId: id},
            select: {
                id: true,
                title: true,
                description: true,
                archived: true,
                createdAt: true
            },
            orderBy: {createdAt: SortOrder.desc}
        })
        res.json(ideas)
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
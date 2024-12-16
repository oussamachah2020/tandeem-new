import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/common/libs/prisma";
import {constants} from "http2";

interface TypedNextApiRequest extends NextApiRequest {
    query: {
        id: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {id} = req.query
    const employee = await prisma.employee.findUnique({where: {id}})
    if (employee) {
        const partners = await prisma.partner.findMany({
            where: {
                offers: {
                    some: {
                        acceptedBy: {
                            some: {
                                customerId: employee.customerId,
                                for: {has: employee.level}
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                logo: true
            }
        })
        res.json(partners)
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
import {NextApiRequest, NextApiResponse} from 'next'
import prisma from "@/common/libs/prisma";

interface TypedNextApiRequest extends NextApiRequest {
    body: {
        email: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {email} = req.body
    const exists = await prisma.user.count({where: {email}})
    res.json(!(!!exists))
}
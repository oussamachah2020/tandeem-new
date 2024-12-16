import {NextApiResponse} from "next";
import prisma from "@/common/libs/prisma";
import {constants} from "http2";

interface TypedNextApiRequest {
    query: { id: string }
    body: {
        title: string,
        description: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {id} = req.query
    const {description, title} = req.body
    const employee = await prisma.employee.findUnique({where: {id}})
    if (employee) {
        await prisma.ideaBox.create({
            data: {
                title,
                description,
                employeeId: id
            }
        })
        res.status(constants.HTTP_STATUS_OK).end()
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
import {NextApiResponse} from "next";
import prisma from "@/common/libs/prisma";
import {constants} from "http2";

interface TypedNextApiRequest {
    query: { id: string }
    body: { id: string }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {id: employeeId} = req.query
    const {id: ideaId} = req.body
    const employee = await prisma.employee.findUnique({where: {id: employeeId}})
    if (employee) {
        const employeeOwnsIdea = await prisma.ideaBox.count({
            where: {
                id: ideaId,
                employeeId: employeeId
            }
        })
        if (employeeOwnsIdea) {
            await prisma.ideaBox.delete({where: {id: ideaId}})
            res.status(constants.HTTP_STATUS_OK).end()
        } else {
            res.status(constants.HTTP_STATUS_FORBIDDEN).end()
        }
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
import {NextApiResponse} from "next";
import prisma from "@/common/libs/prisma";
import {constants} from "http2";

interface TypedNextApiRequest {
    body: { id: string }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {id: employeeId} = req.body
    const employee = await prisma.employee.findUnique({where: {id: employeeId}})
    if (employee) {
        await prisma.employee.update({
            where: {id: employeeId},
            data: {acceptedTOS: true}
        })
        res.status(constants.HTTP_STATUS_OK).end()
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}
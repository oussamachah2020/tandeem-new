import {NextApiRequest, NextApiResponse} from 'next'
import authService from "@/common/services/AuthService";
import prisma from "@/common/libs/prisma";
import {Category, Role} from "@prisma/client";
import {constants} from "http2";
import staticValues from "@/common/context/StaticValues";


interface TypedNextApiRequest extends NextApiRequest {
    body: {
        email: string,
        password: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {email, password} = req.body
    const user = await authService.matchUser(email, password)
    if (user && user.role === Role.EMPLOYEE) {
        const {employee} = user
        const details = await prisma.employee.findUnique({
            where: {id: employee!.id},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                registration: true,
                phone: true,
                photo: true,
                acceptedTOS: true,
                customer: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        logo: true,
                        website: true,
                        category: true
                    }
                },
                department: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        })
        res.json(
            {
                ...details,
                customer: {
                    ...details?.customer,
                    category: staticValues.category[details?.customer.category as keyof typeof Category]
                }
            }
        )
    } else res.status(constants.HTTP_STATUS_UNAUTHORIZED).end()
}
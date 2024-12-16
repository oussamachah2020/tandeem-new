import {NextApiRequest, NextApiResponse} from "next";
import {EmployeeCreateDto, EmployeeCreateFilesDto} from "@/domain/employees/dtos/EmployeeCreateDto";
import {handle} from "@/apiMiddleware";
import employeeService from "@/domain/employees/services/EmployeeService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<EmployeeCreateDto, EmployeeCreateFilesDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: employeeDto, files: {photo}} = payload
        return await employeeService.addOne({...employeeDto, customerId: user.customer!.id, photo})
    }, ['photo'])

export const config = {
    api: {
        bodyParser: false,
    }
};

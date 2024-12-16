import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import employeeService from "@/domain/employees/services/EmployeeService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload) => {
        return await employeeService.deleteOne(payload.body.id);
    })
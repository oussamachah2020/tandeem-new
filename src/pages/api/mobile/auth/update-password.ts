import {NextApiRequest, NextApiResponse} from "next";
import employeeService from "@/domain/employees/services/EmployeeService";

interface TypedNextApiRequest extends NextApiRequest {
    body: {
        email: string,
        oldPassword: string,
        newPassword: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {email, oldPassword, newPassword} = req.body;
    const success = await employeeService.updatePassword(email, oldPassword, newPassword);
    res.json({success})
}
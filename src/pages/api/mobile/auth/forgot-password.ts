import {NextApiRequest, NextApiResponse} from "next";
import employeeService from "@/domain/employees/services/EmployeeService";
import {constants} from "http2";

interface TypedNextApiRequest extends NextApiRequest {
    body: {
        email: string
    }
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {email} = req.body;
    const success = await employeeService.requestPasswordReset(email);
    res
        .status(success ? constants.HTTP_STATUS_OK : constants.HTTP_STATUS_NOT_FOUND)
        .json({success})
}
import {NextApiRequest, NextApiResponse} from "next";
import {CustomerCreateDto, CustomerCreateFilesDto} from "@/domain/customers/dtos/CustomerCreateDto";
import customerService from "@/domain/customers/services/CustomerService";
import {handle} from "@/apiMiddleware";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<CustomerCreateDto, CustomerCreateFilesDto>(req, res, async (payload) => {
        const {body: customerDto, files: {logo, contractScan}} = payload
        return await customerService.addOne({...customerDto, logo, contractScan})
    }, ['logo', 'contractScan'])

export const config = {
    api: {
        bodyParser: false,
    },
};

import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import {CustomerUpdateDto, CustomerUpdateFilesDto} from "@/domain/customers/dtos/CustomerUpdateDto";
import customerService from "@/domain/customers/services/CustomerService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<CustomerUpdateDto, CustomerUpdateFilesDto>(req, res, async (payload) => {
        const {body: editContractorDto, files: {logo}} = payload
        return await customerService.updateOne({...editContractorDto, logo})
    }, ['logo'])

export const config = {
    api: {
        bodyParser: false,
    },
};

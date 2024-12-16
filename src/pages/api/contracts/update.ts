import {NextApiRequest, NextApiResponse} from "next";
import contractService from "@/domain/contracts/services/ContractService";
import {ContractUpdateDto, EditContractFilesDto} from "@/domain/contracts/dtos/ContractUpdateDto";
import {handle} from "@/apiMiddleware";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<ContractUpdateDto, EditContractFilesDto>(req, res, async (payload) => {
        const {body: editContractDto, files: {scan}} = payload
        return await contractService.updateOne({...editContractDto, scan})
    }, ['scan'])

export const config = {
    api: {
        bodyParser: false,
    }
};

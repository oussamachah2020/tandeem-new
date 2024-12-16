import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import {CustomerUpdateFilesDto} from "@/domain/customers/dtos/CustomerUpdateDto";
import {PartnerUpdateDto} from "@/domain/partners/dtos/PartnerUpdateDto";
import partnerService from "@/domain/partners/services/PartnerService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<PartnerUpdateDto, CustomerUpdateFilesDto>(req, res, async (payload) => {
        const {body: editContractorDto, files: {logo}} = payload
        return await partnerService.updateOne({...editContractorDto, logo})
    }, ['logo'])

export const config = {
    api: {
        bodyParser: false,
    },
};

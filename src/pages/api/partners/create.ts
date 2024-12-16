import {NextApiRequest, NextApiResponse} from "next";
import {PartnerCreateDto, PartnerCreateFilesDto} from "@/domain/partners/dtos/PartnerCreateDto";
import {handle} from "@/apiMiddleware";
import partnerService from "@/domain/partners/services/PartnerService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<PartnerCreateDto, PartnerCreateFilesDto>(req, res, async (payload) => {
        const {body: partnerDto, files: {logo, contractScan}} = payload
        return await partnerService.addOne({...partnerDto, logo, contractScan})
    }, ['logo', 'contractScan'])

export const config = {
    api: {
        bodyParser: false,
    },
};

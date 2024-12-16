import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import partnerService from "@/domain/partners/services/PartnerService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload) => {
        return await partnerService.deleteOne(payload.body.id);
    })
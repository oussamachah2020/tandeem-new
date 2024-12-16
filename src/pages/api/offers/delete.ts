import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import offerService from "@/domain/offers/shared/services/OfferService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload) => {
        return await offerService.deleteOffer(payload.body.id);
    })
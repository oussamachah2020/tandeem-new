import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import offerService from "@/domain/offers/shared/services/OfferService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload) => {
        const action = (req.query['action'] as string[])[0]
        return await offerService.switchActivation({offerId: payload.body.id, active: action === 'activate'})
    })

import {NextApiRequest, NextApiResponse} from "next";
import offerService from "@/domain/offers/shared/services/OfferService";
import {handle} from "@/apiMiddleware";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload, useUser) => {
        const user = await useUser()
        return await offerService.unAcceptOffer({offerId: payload.body.id, customerId: user.customer!.id});
    })

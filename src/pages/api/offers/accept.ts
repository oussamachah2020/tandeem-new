import {NextApiRequest, NextApiResponse} from "next";
import offerService from "@/domain/offers/shared/services/OfferService";
import {OfferAcceptDto} from "@/domain/offers/shared/dtos/OfferAcceptDto";
import {handle} from "@/apiMiddleware";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<OfferAcceptDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const acceptOfferDto = payload.body
        return await offerService.acceptOffer({...acceptOfferDto, customerId: user.customer!.id})
    })

import {NextApiRequest, NextApiResponse} from "next";
import {NAPaymentDetails, OfferCreateDto, OfferCreateFilesDto} from "@/domain/offers/shared/dtos/OfferCreateDto";
import offerService from "@/domain/offers/shared/services/OfferService";
import {handle} from "@/apiMiddleware";
import {getRoleLevel} from "@/common/utils/functions";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<OfferCreateDto, OfferCreateFilesDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: offerDto, files: {image, coupon}} = payload
        const roleLevel = getRoleLevel(user.role);
        if (roleLevel === 1)
            return await offerService.addLevel1Offer({
                ...offerDto,
                image,
                coupon
            })
        else if (roleLevel === 2)
            return await offerService.addLevel2Offer({
                ...offerDto,
                image,
                contractorId: user.customer!.id,
                paymentDetails: JSON.stringify({description: offerDto.paymentDetails} as NAPaymentDetails)
            })
    }, ['image', "coupon"])

export const config = {
    api: {
        bodyParser: false,
    }
};

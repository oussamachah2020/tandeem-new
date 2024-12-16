import {handle} from "@/apiMiddleware";
import {OfferUpdateDto, OfferUpdateFilesDto} from "@/domain/offers/shared/dtos/OfferUpdateDto";
import {NextApiRequest, NextApiResponse} from "next";
import offerService from "@/domain/offers/shared/services/OfferService";
import {getRoleLevel} from "@/common/utils/functions";
import {NAPaymentDetails} from "@/domain/offers/shared/dtos/OfferCreateDto";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<OfferUpdateDto, OfferUpdateFilesDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: offerUpdateDto, files: {image, coupon}} = payload
        const roleLevel = getRoleLevel(user.role);
        if (roleLevel === 1)
            return await offerService.updateLevel1Offer({
                ...offerUpdateDto,
                image,
                coupon
            })
        else if (roleLevel === 2)
            return await offerService.updateLevel2Offer({
                ...offerUpdateDto,
                image,
                contractorId: user.customer!.id,
                paymentDetails: JSON.stringify({description: offerUpdateDto.paymentDetails} as NAPaymentDetails)
            })

    }, ['image', "coupon"])

export const config = {
    api: {
        bodyParser: false,
    }
};
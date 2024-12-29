import {NextApiRequest, NextApiResponse} from 'next'
import prisma from "@/common/libs/prisma";
import {SubPaymentMethod} from "@prisma/client";
import {constants} from "http2";
import {
    CouponPaymentDetails,
    PromoCodeMultiplePaymentDetails,
    PromoCodeOnePaymentDetails
} from "@/domain/offers/shared/dtos/OfferCreateDto";

interface TypedNextApiRequest extends NextApiRequest {
  body: { employeeId: string; offerId: string };
}

interface PaymentResponse {
  details: string;
  method: "PromoCode" | "Coupon";
}

async function handlePromoCodeOne(
  offerId: string,
  payment: PromoCodeOnePaymentDetails
): Promise<PaymentResponse | null> {
  if (payment.used < payment.usageLimit) {
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        paymentDetails: {
          ...payment,
          used: payment.used + 1,
        } as any,
      },
    });
    return { details: payment.code, method: "PromoCode" };
  }
  return null;
}

async function handlePromoCodeMultiple(
  offerId: string,
  payment: PromoCodeMultiplePaymentDetails
): Promise<PaymentResponse | null> {
  const unusedCodes =
    payment.codes.filter((code) => !payment.usedCodes.includes(code)) ?? [];
  if (unusedCodes.length) {
    const code = unusedCodes[unusedCodes.length - 1];
    const updatedPayment = {
      ...payment,
      usedCodes: [...payment.usedCodes, code],
    };
    await prisma.offer.update({
      where: { id: offerId },
      data: { paymentDetails: updatedPayment as any },
    });
    return { details: code, method: "PromoCode" };
  }
  return null;
}

function handleCoupon(payment: CouponPaymentDetails): PaymentResponse {
  return { details: payment.couponRef, method: "Coupon" };
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
  const { employeeId, offerId } = req.body;

  try {
    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      const employeeConsumedOffer =
        await prisma.employeeConsumedOffers.findUnique({
          where: {
            employeeId_offerId: {
              employeeId,
              offerId,
            },
          },
          include: { offer: true },
        });

      if (employeeConsumedOffer) {
        return { status: constants.HTTP_STATUS_FORBIDDEN };
      }

      const newEmployeeConsumedOffer =
        await prisma.employeeConsumedOffers.create({
          data: { offerId, employeeId },
          include: { offer: true },
        });

      const {
        offer: { id, subPaymentMethod, paymentDetails },
      } = newEmployeeConsumedOffer;

      let response: PaymentResponse | null = null;

      switch (subPaymentMethod) {
        case SubPaymentMethod.PromoCode_OneCode:
          response = await handlePromoCodeOne(
            id,
            paymentDetails as any as PromoCodeOnePaymentDetails
          );
          break;

        case SubPaymentMethod.PromoCode_MultipleCodes:
          response = await handlePromoCodeMultiple(
            id,
            paymentDetails as any as PromoCodeMultiplePaymentDetails
          );
          break;

        case SubPaymentMethod.Coupon_Generated:
        case SubPaymentMethod.Coupon_Pregenerated:
          response = handleCoupon(
            paymentDetails as any as CouponPaymentDetails
          );
          break;
      }

      return {
        status: response ? 200 : constants.HTTP_STATUS_NOT_FOUND,
        data: response,
      };
    });

    if (result.status === 200 && result.data) {
      res.json(result.data);
    } else {
      res.status(result.status).end();
    }
  } catch (error) {
    console.error("Error processing offer consumption:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: "Failed to process offer consumption",
    });
  }
};
import {
  CouponPaymentDetails,
  OfferCreateDto,
  OfferCreateFilesDto,
} from "@/domain/offers/shared/dtos/OfferCreateDto";
import { OfferStatusName, SubPaymentMethod } from "@prisma/client";
import fileService from "@/common/services/FileService";
import { OfferAcceptDto } from "@/domain/offers/shared/dtos/OfferAcceptDto";
import prisma from "@/common/libs/prisma";
import {
  OfferUpdateDto,
  OfferUpdateFilesDto,
} from "@/domain/offers/shared/dtos/OfferUpdateDto";
import { OfferActivationDto } from "@/domain/offers/shared/dtos/OfferActivationDto";
import {
  ArrayElement,
  WithNonNullable,
  WithRequired,
} from "@/common/utils/types";
import staticValues from "@/common/context/StaticValues";
import createReport from "docx-templates";
import qr from "qr-image";
import { Blob } from "buffer";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../../firebase";

class OfferService {
  getAllForLevel1 = async () => {
    const results = await prisma.offer.findMany({
      where: {
        partner: { isNot: null },
      },
      include: {
        partner: {
          include: {
            contract: true,
            representative: true,
          },
        },
      },
    });
    return results as WithNonNullable<
      ArrayElement<typeof results>,
      "partner"
    >[];
  };

  getAllForLevel2 = async () => {
    const results = await prisma.offer.findMany({
      where: {
        partner: { isNot: null },
        status: OfferStatusName.Active,
      },
      include: {
        acceptedBy: true,
        partner: {
          include: {
            contract: true,
            representative: true,
          },
        },
      },
    });
    return results as WithNonNullable<
      ArrayElement<typeof results>,
      "partner"
    >[];
  };

  updateLevel1Offer = async (
    offerUpdateDto: OfferUpdateDto & OfferUpdateFilesDto,
  ): Promise<keyof typeof staticValues.notification> => {
    if (offerUpdateDto.image)
      await fileService.replace(offerUpdateDto.imageRef, offerUpdateDto.image);
    if (offerUpdateDto.coupon) {
      if (
        offerUpdateDto.subPaymentMethod === SubPaymentMethod.Coupon_Generated
      ) {
        try {
          const buffer = await createReport({
            template: Buffer.from(await offerUpdateDto.coupon.arrayBuffer()),
            data: JSON.parse(offerUpdateDto.paymentDetails!),
            cmdDelimiter: ["{", "}"],
            additionalJsContext: {
              qrCode: () => {
                const qrImage = qr.imageSync(offerUpdateDto.paymentDetails!, {
                  type: "png",
                  margin: 2,
                  size: 4,
                });
                return {
                  width: 6,
                  height: 6,
                  data: qrImage,
                  extension: ".png",
                };
              },
            },
          });
          await fileService.replace(
            offerUpdateDto.couponRef,
            new Blob([buffer], { type: offerUpdateDto.coupon.type }),
          );
        } catch (e) {
          return "generateCouponError";
        }
      } else {
        await fileService.replace(
          offerUpdateDto.couponRef,
          offerUpdateDto.coupon,
        );
      }
    }
    const paymentDetails = offerUpdateDto.paymentDetails
      ? offerUpdateDto.subPaymentMethod === SubPaymentMethod.Coupon_Generated
        ? offerUpdateDto.coupon
          ? {
              couponRef: offerUpdateDto.couponRef,
              data: JSON.parse(offerUpdateDto.paymentDetails),
            }
          : undefined
        : JSON.parse(offerUpdateDto.paymentDetails)
      : undefined;
    await prisma.offer.update({
      data: {
        title: offerUpdateDto.title,
        description: offerUpdateDto.description,
        from: new Date(offerUpdateDto.from),
        to: new Date(offerUpdateDto.to),
        discount: Number(offerUpdateDto.discount),
        initialPrice: Number(offerUpdateDto.initialPrice),
        finalPrice: Number(offerUpdateDto.finalPrice),
        category: offerUpdateDto.category,
        subPaymentMethod: offerUpdateDto.subPaymentMethod,
        paymentDetails,
      },
      where: { id: offerUpdateDto.offerId },
    });
    return "offerUpdatedSuccess";
  };

  updateLevel2Offer = async (
    offerUpdateDto: WithRequired<OfferUpdateDto, "paymentDetails"> &
      OfferUpdateFilesDto,
  ): Promise<keyof typeof staticValues.notification> => {
    if (offerUpdateDto.image)
      await fileService.replace(offerUpdateDto.imageRef, offerUpdateDto.image);
    await prisma.offer.update({
      data: {
        title: offerUpdateDto.title,
        description: offerUpdateDto.description,
        from: new Date(offerUpdateDto.from),
        to: new Date(offerUpdateDto.to),
        discount: Number(offerUpdateDto.discount),
        initialPrice: Number(offerUpdateDto.initialPrice),
        finalPrice: Number(offerUpdateDto.finalPrice),
        category: offerUpdateDto.category,
        paymentDetails: JSON.parse(offerUpdateDto.paymentDetails),
      },
      where: {
        id: offerUpdateDto.offerId,
        customerId: offerUpdateDto.contractorId,
      },
    });
    return "offerUpdatedSuccess";
  };

  acceptOffer = async ({
    offerId,
    customerId,
    levels,
    pinned,
  }: OfferAcceptDto): Promise<keyof typeof staticValues.notification> => {
    await prisma.acceptedOffer.upsert({
      create: {
        offerId,
        customerId,
        for: Array.isArray(levels) ? levels : [levels],
        pinned: pinned !== undefined,
      },
      update: {
        for: Array.isArray(levels) ? levels : [levels],
        pinned: pinned !== undefined,
      },
      where: {
        customerId_offerId: { customerId, offerId },
      },
    });
    return "offerAcceptedSuccess";
  };

  unAcceptOffer = async ({
    offerId,
    customerId,
  }: {
    offerId: string;
    customerId: string;
  }): Promise<keyof typeof staticValues.notification> => {
    await prisma.acceptedOffer.delete({
      where: {
        customerId_offerId: { customerId, offerId },
      },
    });
    return "offerUnacceptedSuccess";
  };

  switchActivation = async ({
    offerId,
    active,
  }: OfferActivationDto): Promise<keyof typeof staticValues.notification> => {
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: active ? OfferStatusName.Active : OfferStatusName.Inactive,
      },
    });
    return active ? "offerEnabledSuccess" : "offerDisabledSuccess";
  };

  addLevel1Offer = async (
    offerDto: OfferCreateDto,
  ): Promise<keyof typeof staticValues.notification> => {
    let paymentDetails: any;

    try {
      //   if (offerDto.subPaymentMethod === SubPaymentMethod.Coupon_Pregenerated) {
      //     if (!offerDto.coupon) {
      //       return "missingCouponUrlError";
      //     }
      //     paymentDetails = { couponRef: offerDto.coupon } as CouponPaymentDetails;
      //   } else if (
      //     offerDto.subPaymentMethod === SubPaymentMethod.Coupon_Generated
      //   ) {
      //     try {
      //       const buffer = await createReport({
      //         template: Buffer.from(offerDto.coupon),
      //         data: JSON.parse(offerDto.paymentDetails),
      //         cmdDelimiter: ["{", "}"],
      //         additionalJsContext: {
      //           qrCode: () => {
      //             const qrImage = qr.imageSync(offerDto.paymentDetails, {
      //               type: "png",
      //               margin: 2,
      //               size: 4,
      //             });
      //             return {
      //               width: 6,
      //               height: 6,
      //               data: qrImage,
      //               extension: ".png",
      //             };
      //           },
      //         },
      //       });

      //       if (!offerDto.coupon) {
      //         return "missingGeneratedCouponUrlError";
      //       }

      //       paymentDetails = {
      //         couponRef: offerDto.coupon,
      //         data: JSON.parse(offerDto.paymentDetails),
      //       } as CouponPaymentDetails;
      //     } catch (e) {
      //       return "generateCouponError";
      //     }
      //   } else {
      //     paymentDetails = JSON.parse(offerDto.paymentDetails);
      //   }

      //   // Ensure image URL is provided
      if (!offerDto.imageUrl) {
        return "missingImageUrlError";
      }

      await prisma.offer.create({
        data: {
          title: offerDto.title,
          description: offerDto.description,
          image: offerDto.imageUrl, // Only stores URL now
          category: offerDto.category,
          from: new Date(offerDto.from),
          to: new Date(offerDto.to),
          codePromo: offerDto.codePromo,
          initialPrice: Number(offerDto.initialPrice),
          finalPrice: Number(offerDto.finalPrice),
          discount: Number(offerDto.discount),
          subPaymentMethod: offerDto.subPaymentMethod,
          paymentDetails,
          partner: { connect: { id: offerDto.contractorId } },
        },
      });

      return "offerAddedSuccess";
    } catch (error) {
      console.error("Error adding offer:", error);
      return "offerUploadError";
    }
  };

  addLevel2Offer = async (
    offerDto: OfferCreateDto,
  ): Promise<keyof typeof staticValues.notification> => {
    await prisma.offer.create({
      data: {
        title: offerDto.title,
        description: offerDto.description,
        image: offerDto.imageUrl,
        category: offerDto.category,
        from: new Date(offerDto.from),
        to: new Date(offerDto.to),
        initialPrice: Number(offerDto.initialPrice),
        finalPrice: Number(offerDto.finalPrice),
        discount: Number(offerDto.discount),
        subPaymentMethod: SubPaymentMethod.NA,
        paymentDetails: JSON.parse(offerDto.paymentDetails),
        customer: { connect: { id: offerDto.contractorId } },
      },
    });
    return "offerAddedSuccess";
  };

  deleteOffer = async (
    id: string,
  ): Promise<keyof typeof staticValues.notification> => {
    await prisma.offer.delete({ where: { id } });
    return "offerDeletedSuccess";
  };
}

let offerService: OfferService;

if (process.env.NODE_ENV === "production") offerService = new OfferService();
else {
  if (!global.offerService) global.offerService = new OfferService();
  offerService = global.offerService;
}
export default offerService;

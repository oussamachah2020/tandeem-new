import { ChangeEvent, FC, useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import partnerService from "@/domain/partners/services/PartnerService";
import { getLabeledSubCategories } from "@/common/utils/functions";
import { EitherInput } from "@/common/components/atomic/EitherInput";
import { PaymentMethod, SubCategory, SubPaymentMethod } from "@prisma/client";
import { PromoCodeForm } from "@/domain/offers/level-one/components/PromoCodeForm";
import { ArrayElement } from "@/common/utils/types";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import CouponForm from "@/domain/offers/level-one/components/CouponForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { OfferCreateDto } from "../../shared/dtos/OfferCreateDto";
import { storage } from "../../../../../firebase";
import { useAuthStore } from "@/zustand/auth-store";
import toast from "react-hot-toast";

interface Props {
  partners: Awaited<ReturnType<typeof partnerService.getAll>>;
  onClose: () => void;
}

export const OfferCreateForm = ({ partners, onClose }: Props) => {
  const { label, tooltip, subCategory } = useStaticValues();
  const [selectedPartner, setSelectedPartner] =
    useState<ArrayElement<typeof partners>>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { accessToken } = useAuthStore();

  const handlePartnerSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const partner = partners.find(
      (partner) => partner.id === e.currentTarget.value,
    );
    setSelectedPartner(partner);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    const storageRef = ref(storage, `offers/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  function generatePromoCode(length: number = 8): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let promoCode = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      promoCode += characters[randomIndex];
    }

    return promoCode;
  }

  // Example usage:

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    toast.loading("Un moment...", { id: "create" });
    const newPromoCode = generatePromoCode();

    try {
      // Upload image to Firebase Storage
      const imageUrl = imageFile ? await handleImageUpload(imageFile) : null;

      // Construct the OfferCreateDto object
      const offerData: OfferCreateDto = {
        contractorId: formData.get("contractorId") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as SubCategory,
        subPaymentMethod: SubPaymentMethod.PromoCode_OneCode,
        from: formData.get("from") as string,
        to: formData.get("to") as string,
        discount: formData.get("discount") as string,
        initialPrice: formData.get("initialPrice") as string,
        finalPrice: formData.get("finalPrice") as string,
        paymentDetails: formData.get("paymentDetails") as string,
        imageUrl: imageUrl || "",
        codePromo: newPromoCode,
      };

      // Send the data to the API endpoint
      const response = await fetch("/api/offers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        toast.error("Failed to create offer. Please try again.");
      }

      onClose();
      toast.success("Offre créée avec succès !");
    } catch (error: any) {
      setError(error.message || "An unknown error occurred.");
    } finally {
      toast.dismiss("create");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        handleSubmit(formData);
      }}
    >
      <Input
        icon="HashtagIcon"
        name="title"
        label={label.title}
        placeholder={label.title}
      />
      <Input
        icon="NewspaperIcon"
        name="description"
        label={label.description}
        placeholder={label.description}
        type="textarea"
        className="mt-2"
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Input
          icon="BriefcaseIcon"
          name="contractorId"
          label={label.partner}
          placeholder={label.choosePartner}
          type="select"
          onChange={handlePartnerSelect}
          options={partners.reduce(
            (acc, partner) => ({ ...acc, [partner.id]: partner.name }),
            {},
          )}
        />
        <Input
          icon="SwatchIcon"
          name="category"
          label={label.category}
          placeholder={label.chooseCategory}
          type="select"
          options={Object.fromEntries(
            getLabeledSubCategories(subCategory, selectedPartner?.category),
          )}
        />
        <Input
          icon="CalendarDaysIcon"
          name="from"
          label={label.startDate}
          type="date"
          initialValue={new Date()}
          min={selectedPartner?.contract.from}
        />
        <Input
          icon="CalendarDaysIcon"
          name="to"
          label={label.endDate}
          type="date"
          max={selectedPartner?.contract.to}
        />
        <EitherInput
          className="grid-cols-3 col-span-2"
          colSpans={["col-span-1", "col-span-2"]}
          labels={[
            label.reductionPercentage,
            `${label.initialPrice}/${label.finalPrice}`,
          ]}
          nodes={[
            <Input
              icon="ReceiptPercentIcon"
              name="discount"
              placeholder="00.0"
              type="number"
              min={1}
              max={100}
            />,
            <div className="grid grid-cols-2 gap-4">
              <Input
                icon="BanknotesIcon"
                name="initialPrice"
                placeholder={label.initialPrice}
                type="number"
                min={0}
              />
              <Input
                icon="BanknotesIcon"
                name="finalPrice"
                placeholder={label.finalPrice}
                type="number"
                min={0}
              />
            </div>,
          ]}
        />
        {/* {selectedPartner?.accepts === PaymentMethod.PromoCode && (
          <PromoCodeForm className="col-span-2" />
        )}
        {selectedPartner?.accepts === PaymentMethod.Coupon && (
          <CouponForm className="col-span-2" />
        )} */}
      </div>
      <Input
        icon="CloudArrowUpIcon"
        name="image"
        label={label.image}
        placeholder={label.image}
        type="file"
        accept="image"
        tooltip={tooltip.sixteenByNineAspectRatio}
        className="mt-3"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
          }
        }}
      />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button
        type="submit"
        className={`btn ${
          isSubmitting ? "btn-disabled" : ""
        } w-full bg-secondary h-12 mt-5 flex flex-row justify-center items-center gap-2 rounded-md text-white`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Ajouter"}
        <PlusIcon className="h-5 w-5" />
      </button>
    </form>
  );
};

import { FC, useState, useMemo } from "react";
import { Input } from "@/common/components/atomic/Input";
import partnerService from "@/domain/partners/services/PartnerService";
import { ArrayElement } from "@/common/utils/types";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { useAuthStore } from "@/zustand/auth-store";
import toast from "react-hot-toast";

interface Props {
  partner: ArrayElement<
    Awaited<ReturnType<typeof partnerService.getAllIncludeOffers>>
  >;
  onClose: () => void;
}

export const PartnerUpdateForm: FC<Props> = ({ partner, onClose }) => {
  const hasOffers = useMemo(
    () => partner?.offers?.length > 0,
    [partner?.offers?.length]
  );
  const { label, category, paymentMethod, tooltip } = useStaticValues();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Extracting logo URL
    const logoUrl = formData.get("logo") as string;

    const updatedPartnerData = {
      ...data,
      logo: logoUrl, // Set the logo URL
    };

    try {
      const response = await fetch("/api/partners/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPartnerData),
      });

      if (!response.ok) {
        throw new Error("Failed to update partner.");
      }

      const result = await response.json();
      toast.success("Partner updated successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={partner.id} name="id" className="hidden" type="text" />
      <div className="mb-6">
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-xl">{label.information}</h3>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <Input
                icon="BuildingOfficeIcon"
                name="name"
                label={label.companyName}
                placeholder={label.companyName}
                initialValue={partner.name}
                className={hasOffers ? "col-span-2" : "col-span-1"}
              />
              <Input
                icon="MapPinIcon"
                name="address"
                label={label.address}
                placeholder={label.address}
                initialValue={partner.address[0]}
              />
              <Input
                icon="GlobeAltIcon"
                name="website"
                label={label.website}
                placeholder={label.website}
                type="url"
                initialValue={partner.website}
              />
              <Input
                icon="PhotoIcon"
                name="logo"
                label={label.logo}
                placeholder={label.logo}
                type="text" // Assuming logo is a URL entered as text
                initialValue={partner.logo}
                required={false}
              />
              <Input
                icon="SwatchIcon"
                name="category"
                label={label.category}
                placeholder={label.chooseCategory}
                type="select"
                tooltip={tooltip.partnerUpdateCategory}
                options={category}
                selected={partner.category}
              />
              {!hasOffers && (
                <Input
                  icon="CreditCardIcon"
                  name="accepts"
                  label={label.paymentMethod}
                  placeholder={label.choosePaymentMethod}
                  type="select"
                  options={paymentMethod}
                  selected={partner.accepts}
                />
              )}
            </div>
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-xl">{label.representative}</h3>
          <div className="grid grid-cols-3 gap-3">
            <Input
              icon="UserIcon"
              name="representativeName"
              label={label.name}
              placeholder={label.name}
              type="text"
              initialValue={partner.representative.fullName}
            />
            <Input
              icon="EnvelopeIcon"
              name="representativeEmail"
              label={label.email}
              placeholder={label.email}
              type="email"
              required={false}
              initialValue={partner.representative.email}
            />
            <Input
              icon="PhoneIcon"
              name="representativePhone"
              label={label.phone}
              placeholder={label.phone}
              type="tel"
              required={false}
              initialValue={partner.representative.phone}
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`bg-secondary w-full text-white px-4 py-2 rounded mt-4 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Modifier"}
      </button>
    </form>
  );
};

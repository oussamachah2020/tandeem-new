import { useForm, Controller } from "react-hook-form";
import { Input } from "@/common/components/atomic/Input";
import Form from "@/common/components/global/Form";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import Button from "@/common/components/atomic/Button";
import { useAuthStore } from "@/zustand/auth-store";

type Props = {
  onClose: () => void;
};

export const PartnerCreateForm = ({ onClose }: Props) => {
  const { label, category, paymentMethod } = useStaticValues();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      website: "",
      category: "",
      logo: null,
      accepts: "",
      contractScan: null,
      contractFrom: "",
      contractTo: "",
      representativeName: "",
      representativePhone: "",
      representativeEmail: "",
    },
  });

  const { accessToken } = useAuthStore();

  const onSubmit = async (data: any) => {
    const partnerData = {
      name: data.name,
      address: data.address,
      website: data.website,
      category: data.category,
      logoUrl: data.logo,
      accepts: data.accepts,
      scanUrl: data.contractScan,
      contractFrom: new Date(data.contractFrom),
      contractTo: new Date(data.contractTo),
      representativeName: data.representativeName,
      representativePhone: data.representativePhone,
      representativeEmail: data.representativeEmail,
    };

    try {
      const response = await fetch("/api/partners/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(partnerData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        onClose();
        reset();
      } else {
        const responseText = await response.text();
        console.error("Error status:", response.status);
        console.error("Error response:", responseText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-xl">{label.information}</h3>
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  icon="BuildingOfficeIcon"
                  label={label.companyName}
                  placeholder={label.companyName}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  icon="MapPinIcon"
                  label={label.address}
                  placeholder={label.address}
                />
              )}
            />
            <Controller
              name="website"
              control={control}
              rules={{
                required: "Website is required",
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/,
                  message: "Enter a valid URL",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  icon="GlobeAltIcon"
                  label={label.website}
                  placeholder={label.website}
                  type="url"
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  icon="SwatchIcon"
                  label={label.category}
                  placeholder="Choose a category"
                  type="select"
                  options={category}
                />
              )}
            />
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  icon="PhotoIcon"
                  label={label.logo}
                  placeholder={label.logo}
                  type="file"
                  accept="image"
                />
              )}
            />
            <Controller
              name="accepts"
              control={control}
              rules={{ required: "Payment method is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  icon="CreditCardIcon"
                  label={label.paymentMethod}
                  placeholder={label.choosePaymentMethod}
                  type="select"
                  options={paymentMethod}
                />
              )}
            />
          </div>
        </div>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-xl">{label.contract}</h3>
        <div className="grid grid-cols-3 gap-3">
          <Controller
            name="contractScan"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                icon="DocumentTextIcon"
                label={label.scan}
                placeholder={label.scan}
                type="file"
                accept="doc"
              />
            )}
          />
          <Controller
            name="contractFrom"
            control={control}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <Input
                {...field}
                icon="CalendarDaysIcon"
                label={label.startDate}
                type="date"
              />
            )}
          />
          <Controller
            name="contractTo"
            control={control}
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <Input
                {...field}
                icon="CalendarDaysIcon"
                label={label.endDate}
                type="date"
                min={Date.now()}
              />
            )}
          />
        </div>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-xl">{label.representative}</h3>
        <div className="grid grid-cols-3 gap-3">
          <Controller
            name="representativeName"
            control={control}
            rules={{ required: "Representative name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                icon="UserIcon"
                label={label.name}
                placeholder={label.name}
                type="text"
              />
            )}
          />
          <Controller
            name="representativePhone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                icon="PhoneIcon"
                label={label.phone}
                placeholder={label.phone}
                type="tel"
                required={false}
              />
            )}
          />
          <Controller
            name="representativeEmail"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                icon="EnvelopeIcon"
                label={label.email}
                placeholder={label.email}
                type="email"
                required={false}
              />
            )}
          />
        </div>
      </div>
      <Button
        type="submit"
        icon={"PlusIcon"}
        text="Ajouter"
        className="w-full mt-5"
      />
    </form>
  );
};

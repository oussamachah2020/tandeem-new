import Button from "@/common/components/atomic/Button";
import { Input } from "@/common/components/atomic/Input";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { useAuthStore } from "@/zustand/auth-store";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { storage } from "../../../../firebase";

// Define the form data type for TypeScript
type CustomerCreateFormData = {
  name: string;
  address: string;
  email: string;
  website?: string;
  logo?: string;
  category: string;
  maxEmployees: number;
  contractScan?: string;
  contractFrom: string;
  contractTo: string;
  representativeName: string;
  representativePhone?: string;
  representativeEmail?: string;
};

type Props = { onClose: () => void };

export const CustomerCreateForm = ({ onClose }: Props) => {
  const { label, category, tooltip } = useStaticValues();
  const { accessToken } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<CustomerCreateFormData>();
  const [logo, setLogo] = useState<File | null>(null);
  const [contract, setContract] = useState<File | null>(null);

  const uploadFileToFirebase = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const onSubmit = async (data: CustomerCreateFormData) => {
    try {
      // Upload logo to Firebase if provided
      const logoUrl = logo
        ? await uploadFileToFirebase(logo, `logos/${logo.name}`)
        : "";

      // Upload contract scan to Firebase if provided
      const contractUrl = contract
        ? await uploadFileToFirebase(contract, `contracts/${contract.name}`)
        : "";

      // Format the data to match the required JSON structure
      const customerData = {
        ...data,
        logoUrl, // Firebase URL for logo
        contractScan: contractUrl, // Firebase URL for contract scan
        contractFrom: new Date(
          `${data.contractFrom}T00:00:00.000Z`
        ).toISOString(),
        contractTo: new Date(`${data.contractTo}T00:00:00.000Z`).toISOString(),
        maxEmployees: Number(data.maxEmployees),
      };

      const response = await fetch("/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(customerData),
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
      console.error("Error uploading files or submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-xl">{label.information}</h3>
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  icon="BuildingOfficeIcon"
                  label={label.name}
                  placeholder={label.name}
                  {...field}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <Input
                  icon="MapPinIcon"
                  label={label.address}
                  placeholder={label.address}
                  {...field}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  icon="EnvelopeIcon"
                  label={label.email}
                  placeholder={label.email}
                  type="email"
                  tooltip={tooltip.customerAccountEmail}
                  {...field}
                />
              )}
            />
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <Input
                  icon="GlobeAltIcon"
                  label={label.website}
                  placeholder={label.website}
                  type="url"
                  {...field}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e?.target?.files) setLogo(e?.target?.files[0]);
                  }}
                  type="file"
                  accept="image"
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Input
                  icon="SwatchIcon"
                  label={label.category}
                  placeholder={label.chooseCategory}
                  options={category}
                  type="select"
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-xl">{label.conditions}</h3>
        <Controller
          name="maxEmployees"
          control={control}
          rules={{
            required: "Max employees is required",
            min: {
              value: 1,
              message: "Max employees should be at least 1",
            },
          }}
          render={({ field }) => (
            <Input
              icon="UsersIcon"
              label={label.maxNumberOfEmployees}
              placeholder="e.g. 50"
              type="number"
              {...field}
            />
          )}
        />
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
                icon="PhotoIcon"
                label={label.contract}
                placeholder={label.contract}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e?.target?.files) setContract(e?.target?.files[0]);
                }}
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
                icon="CalendarDaysIcon"
                label={label.startDate}
                type="date"
                {...field}
              />
            )}
          />
          <Controller
            name="contractTo"
            control={control}
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <Input
                icon="CalendarDaysIcon"
                label={label.endDate}
                type="date"
                {...field}
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
                icon="UserIcon"
                label={label.name}
                placeholder={label.name}
                type="text"
                {...field}
              />
            )}
          />
          <Controller
            name="representativePhone"
            control={control}
            render={({ field }) => (
              <Input
                icon="PhoneIcon"
                label={label.phone}
                placeholder={label.phone}
                type="tel"
                {...field}
              />
            )}
          />
          <Controller
            name="representativeEmail"
            control={control}
            render={({ field }) => (
              <Input
                icon="EnvelopeIcon"
                label={label.email}
                placeholder={label.email}
                type="email"
                {...field}
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
        disabled={!isValid || isSubmitting}
      />
    </form>
  );
};

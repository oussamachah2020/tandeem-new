import { useForm, Controller } from "react-hook-form";
import { Input } from "@/common/components/atomic/Input";
import Form from "@/common/components/global/Form";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import Button from "@/common/components/atomic/Button";
import { useAuthStore } from "@/zustand/auth-store";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage methods
import { v4 as uuidv4 } from "uuid"; // To generate unique file names
import { storage } from "../../../../firebase";
import { PartnerCreateDto } from "../dtos/PartnerCreateDto";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  onClose: () => void;
};

export const PartnerCreateForm = ({ onClose }: Props) => {
  const { label, category, paymentMethod } = useStaticValues();
  const [addresses, setAddresses] = useState<string[]>([]);

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

  const addAddressField = () => {
    setAddresses([...addresses, ""]);
  };

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    if (!file) {
      throw new Error("No file provided");
    }

    const fileName = `${uuidv4()}_${file.name}`;
    const fileRef = ref(storage, `${folder}/${fileName}`);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  };

  const onSubmit = async (data: any) => {
    toast.loading("Un moment...", { id: "create" });

    try {
      const partnerData: PartnerCreateDto = {
        name: data.name,
        addresses,
        website: data.website,
        category: data.category,
        accepts: data.accepts,
        contractFrom: new Date(data.contractFrom).toISOString(),
        contractTo: new Date(data.contractTo).toISOString(),
        representativeName: data.representativeName,
        representativePhone: data.representativePhone,
        representativeEmail: data.representativeEmail,
        contractScanUrl: "",
        logoUrl: "",
      };

      if (data.logo) {
        partnerData.logoUrl = await uploadFile(data.logo, "logos");
      }

      if (data.contractScan) {
        partnerData.contractScanUrl = await uploadFile(
          data.contractScan,
          "contracts"
        );
      }

      const response = await fetch("/api/partners/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(partnerData),
      });

      if (response.ok) {
        toast.success("Partenaire créé avec succès", { id: "create" });
        reset();
        onClose();
      } else {
        const errorText = await response.text();
        toast.error(`Erreur: ${errorText}`, { id: "create" });
      }
    } catch (error) {
      console.error("Error creating partner:", error);
      toast.error("Erreur lors de la création du partenaire", { id: "create" });
    } finally {
      toast.dismiss("create");
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
            <div>
              <div className="grid grid-cols-2 items-center gap-3">
                {addresses.map((address, index) => (
                  <Input
                    key={index}
                    icon="MapPinIcon"
                    label={`${label.address} ${index + 1}`}
                    placeholder={label.address}
                    initialValue={address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleAddressChange(index, e.target.value)
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={addAddressField}
                className="w-full mt-7 rounded-md h-10 bg-blue-500 text-white text-sm flex flex-row justify-center items-center gap-3"
              >
                Ajouter une Address <PlusIcon className="h-4 w-4" />
              </button>
            </div>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e.target.files ? e.target.files[0] : null);
                  }}
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
                type="file"
                accept="doc"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  field.onChange(e.target.files ? e.target.files[0] : null);
                }}
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
      <button
        type="submit"
        className="w-full rounded-md mt-3 h-12 bg-orange-500 text-white flex flex-row justify-center items-center gap-3"
      >
        Ajouter <PlusIcon className="h-4 w-4" />
      </button>
    </form>
  );
};

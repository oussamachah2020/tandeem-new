import { FC, useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import { ArrayElement } from "@/common/utils/types";
import customerService from "@/domain/customers/services/CustomerService";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import toast from "react-hot-toast";
import { useAuthStore } from "@/zustand/auth-store";

interface Props {
  customer: ArrayElement<Awaited<ReturnType<typeof customerService.getAll>>>;
  onClose: () => void;
}

export const CustomerUpdateForm: FC<Props> = ({ customer, onClose }) => {
  const { label, category, tooltip } = useStaticValues();
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

    try {
      const response = await fetch("/api/customers/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer.");
      }
      onClose();
      toast.success("Customer updated successfully!");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className="hidden" name="id" value={customer.id} />
      <input className="hidden" name="logoRef" value={customer.logo} />
      <div className="mb-6">
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-xl">{label.information}</h3>
          <div>
            <Input
              icon="BuildingOfficeIcon"
              name="name"
              label={label.companyName}
              placeholder={label.companyName}
              initialValue={customer.name}
            />
          </div>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <Input
                icon="MapPinIcon"
                name="address"
                label={label.address}
                placeholder={label.address}
                initialValue={customer.address}
              />
              <Input
                icon="GlobeAltIcon"
                name="website"
                label={label.website}
                placeholder={label.website}
                type="url"
                initialValue={customer.website}
              />
              <Input
                icon="PhotoIcon"
                name="logo"
                label={label.logo}
                placeholder={label.logo}
                type="text "
                required={false}
              />
              <Input
                icon="SwatchIcon"
                name="category"
                label={label.category}
                placeholder={label.chooseCategory}
                type="select"
                tooltip={tooltip.customerUpdateCategory}
                options={category}
                selected={customer.category}
              />
            </div>
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-xl">{label.conditions}</h3>
          <Input
            icon="UsersIcon"
            name="maxEmployees"
            label={label.maxNumberOfEmployees}
            initialValue={customer.maxEmployees}
            type="number"
          />
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
              initialValue={customer.representative.fullName}
            />
            <Input
              icon="PhoneIcon"
              name="representativePhone"
              label={label.phone}
              placeholder={label.phone}
              type="tel"
              initialValue={customer.representative.phone}
            />
            <Input
              icon="EnvelopeIcon"
              name="representativeEmail"
              label={label.email}
              placeholder={label.email}
              type="email"
              initialValue={customer.representative.email}
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`bg-secondary w-full h-12 text-white px-4 py-2 rounded mt-4 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Modifier"}
      </button>
    </form>
  );
};

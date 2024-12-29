import { Input } from "@/common/components/atomic/Input";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { useAuthStore } from "@/zustand/auth-store";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface AdminFormInputs {
  name: string;
  email: string;
  photoUrl: string;
}

type Props = {
  onClose: () => void;
};

const AdminCreateForm = ({ onClose }: Props) => {
  const { label } = useStaticValues();
  const { accessToken } = useAuthStore();
  // Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AdminFormInputs>();

  // Form submission handler
  const onSubmit = async (data: AdminFormInputs) => {
    toast.loading("Creation d'admin en cours...", { id: "create" });
    try {
      const response = await fetch("/api/admins/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Admin created successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      toast.dismiss("create");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              icon="UserIcon"
              label={label.fullName}
              placeholder={label.fullName}
              {...field}
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="email"
          control={control}
          rules={{ required: "email is required" }}
          render={({ field }) => (
            <Input
              icon="EnvelopeIcon"
              label={label.email}
              placeholder={label.email}
              type="text"
              {...field}
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="photoUrl"
          control={control}
          render={({ field }) => (
            <Input
              icon="PhotoIcon"
              label={label.photo}
              placeholder={label.photo}
              {...field}
            />
          )}
        />

        {errors.photoUrl && (
          <p className="text-red-500 text-sm">{errors.photoUrl.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="col-span-3 flex flex-row justify-center items-center gap-3 bg-secondary h-12 text-white px-4 py-2 rounded"
      >
        <PlusIcon className="h-7 w-7" />
        Ajouter
      </button>
    </form>
  );
};

export default AdminCreateForm;

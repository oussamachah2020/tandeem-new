import { Input } from "@/common/components/atomic/Input";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { useAuthStore } from "@/zustand/auth-store";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../firebase"; // ✅ Correct import

interface AdminFormInputs {
  name: string;
  email: string;
  photoUrl: string; // ✅ Changed from `photo` to `photoUrl`
}

type Props = {
  onClose: () => void;
};

const AdminCreateForm = ({ onClose }: Props) => {
  const { label } = useStaticValues();
  const { accessToken } = useAuthStore();

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormInputs>();

  // Handle Image Upload to Firebase
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `admin-photos/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        toast.error("Upload failed!");
        console.error(error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setValue("photoUrl", downloadURL); // ✅ Correct field name
        setImagePreview(downloadURL); // ✅ Show preview
        toast.success("Image uploaded successfully!");
        setUploading(false);
      }
    );
  };

  // Form submission handler
  const onSubmit = async (data: AdminFormInputs) => {
    if (!data.photoUrl) {
      toast.error("Please upload a photo.");
      return;
    }

    toast.loading("Creating admin...", { id: "create" });
    setLoading(true);

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
      toast.error("Failed to create admin.");
    } finally {
      toast.dismiss("create");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
      <div>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
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
          rules={{ required: "Email is required" }}
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
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* File Upload Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label.photo}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
          }}
          className="border p-2 rounded w-full mt-1"
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

        {/* Image Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            className="mt-2 w-20 h-20 object-cover rounded border"
          />
        )}
      </div>

      <button
        type="submit"
        className="col-span-3 flex flex-row justify-center items-center gap-3 bg-secondary h-12 text-white px-4 py-2 rounded"
        disabled={uploading || isSubmitting || loading}
      >
        <PlusIcon className="h-7 w-7" />
        {loading ? "creating..." : "Ajouter"}
      </button>
    </form>
  );
};

export default AdminCreateForm;

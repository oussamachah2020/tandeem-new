import { FC, useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import Button from "@/common/components/atomic/Button";
import { PublicationCreateDto } from "@/domain/publications/dtos/PublicationCreateDto";
import { useAuthStore } from "@/zustand/auth-store";
import toast from "react-hot-toast";

const PublicationCreateForm = ({ onClose }: { onClose: () => void }) => {
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

    const publicationData: PublicationCreateDto = {
      title: data.title as string,
      content: data.content as string,
      photoUrl: "",
      pinned: data.pinned ? true : false, // Checkbox to a string value
    };

    try {
      const response = await fetch("/api/publications/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publicationData),
      });

      if (!response.ok) {
        throw new Error("Failed to create publication.");
      }

      const result = await response.json();
      onClose();
      toast.success("Publication created successfully!");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            icon="HashtagIcon"
            label="Titre"
            name="title"
            placeholder="Titre"
            className="col-span-2"
          />
          <Input
            icon="DocumentTextIcon"
            label="Contenu"
            name="content"
            placeholder="Description/Contenu"
            type="textarea"
            className="col-span-2"
          />
          <Input
            icon="PhotoIcon"
            label="Image"
            name="image"
            placeholder="Image"
            type="file"
            accept="image"
          />
          <Input label="Épinglé" name="pinned" type="checkbox">
            Marquer comme épinglé
          </Input>
        </div>
        <Button
          icon="PlusIcon"
          text={loading ? "Creating..." : "Ajouter"}
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button
        type="submit"
        className="w-full bg-primary h-12 text-white font-semibold rounded-md mt-2"
      >
        Ajouter
      </button>
    </form>
  );
};

export default PublicationCreateForm;

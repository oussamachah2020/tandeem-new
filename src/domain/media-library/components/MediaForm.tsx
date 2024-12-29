import { Input } from "@/common/components/atomic/Input";
import Form from "@/common/components/global/Form";
import { ArrayElement } from "@/common/utils/types";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";
import { useAuthStore } from "@/zustand/auth-store";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  media?: ArrayElement<Awaited<ReturnType<typeof mediaLibraryService.getAll>>>;
  onClose: () => void;
}

const MediaForm = ({ media, onClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    toast.loading("Un moment...", { id: "create" });

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        media ? "/api/media-library/update" : "/api/media-library/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the form. Please try again.");
      }
      onClose();
      toast.success(
        media ? "Médias mis à jour avec succès" : "Média enregistré avec succès"
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
      toast.dismiss("create");
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      {media && <input value={media.id} name="id" className="hidden" />}
      <Input
        icon="HashtagIcon"
        label="Titre"
        name="title"
        placeholder="Titre"
        initialValue={media?.title}
      />
      <Input
        icon="NewspaperIcon"
        label="Description"
        name="description"
        placeholder="Description"
        type="textarea"
        initialValue={media?.description}
      />
      <Input
        icon="LinkIcon"
        label="Lien"
        name="url"
        placeholder="Lien"
        type="url"
        initialValue={media?.url}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-4 py-2 flex flex-row justify-center items-center gap-3 px-4  bg-secondary rounded-md h-12 text-white ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <PlusIcon className="h-7 w-7 text-white" />
        {isSubmitting ? "Submitting..." : media ? "Update" : "Ajouter"}
      </button>
    </form>
  );
};

export default MediaForm;

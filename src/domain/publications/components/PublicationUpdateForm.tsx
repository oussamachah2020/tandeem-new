import { FC, useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import Button from "@/common/components/atomic/Button";
import { PublicationUpdateDto } from "@/domain/publications/dtos/PublicationUpdateDto";
import { ArrayElement } from "@/common/utils/types";
import publicationService from "@/domain/publications/services/PublicationService";
import toast from "react-hot-toast";
import { useAuthStore } from "@/zustand/auth-store";

interface Props {
  publication: ArrayElement<
    Awaited<ReturnType<typeof publicationService.getAll>>
  >;
  onClose: () => void;
}

const PublicationUpdateForm: FC<Props> = ({ publication, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Check if there is a file uploaded for the image
    const imageFile = formData.get("image") as File | null;
    let photoUrl = publication.photo; // Use existing image URL if no new file is uploaded

    // If a new file is uploaded, we'll assume the backend can handle it and process the URL
    if (imageFile) {
      // In your case, you can upload the file to your storage service first and then get the URL
      // For this example, we'll skip that part and assume you get the photoUrl after uploading
      // Update photoUrl as the new image URL (this part should be handled by your API)
      photoUrl = "https://path-to-uploaded-image.com/new-image.jpg"; // Replace with actual image URL after uploading
    }

    const publicationData = {
      id: publication.id,
      title: data.title as string,
      content: data.content as string,
      photoUrl, // Set the photoUrl (either the current or new image URL)
      pinned: data.pinned === "on", // Convert checkbox value to boolean
    };

    try {
      const response = await fetch("/api/publications/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(publicationData),
      });

      if (!response.ok) {
        throw new Error("Failed to update publication.");
      }

      const result = await response.json();
      onClose();
      toast.success("Publication updated successfully!");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input name="id" value={publication.id} className="hidden" />
      <input name="imageRef" value={publication.photo} className="hidden" />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            icon="HashtagIcon"
            label="Titre"
            name="title"
            placeholder="Titre"
            className="col-span-2"
            initialValue={publication.title}
          />
          <Input
            icon="DocumentTextIcon"
            label="Contenu"
            name="content"
            placeholder="Description/Contenu"
            type="textarea"
            className="col-span-2"
            initialValue={publication.content}
          />
          <Input
            icon="PhotoIcon"
            label="Image"
            name="image"
            placeholder="Image"
            type="file"
            accept="image"
            required={false}
          />
          <Input
            label="Épinglé"
            name="pinned"
            type="checkbox"
            initialValue={publication.pinned}
          >
            Marquer comme épinglé
          </Input>
        </div>
        <Button
          icon="PencilSquareIcon"
          text={loading ? "Updating..." : "Modifier"}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full bg-primary h-12 text-white font-semibold rounded-md mt-2"
      >
        Modifier
      </button>
    </form>
  );
};

export default PublicationUpdateForm;

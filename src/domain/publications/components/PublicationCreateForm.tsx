import { useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import Button from "@/common/components/atomic/Button";
import { PublicationCreateDto } from "@/domain/publications/dtos/PublicationCreateDto";
import { useAuthStore } from "@/zustand/auth-store";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../../firebase";
import { XIcon } from "lucide-react";

const PublicationCreateForm = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { accessToken } = useAuthStore();

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const publicationData: PublicationCreateDto = {
      title: data.title as string,
      content: data.content as string,
      photos: [], // Will be updated after upload
      pinned: data.pinned ? true : false,
    };

    try {
      // Upload files to Firebase Storage and collect URLs
      const uploadPromises = uploadedFiles.map(async (file) => {
        const storageRef = ref(
          storage,
          `publications/${Date.now()}_${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedUrls(urls);

      publicationData.photos = urls.length > 0 ? urls : [];

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
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-4 rounded-lg text-center ${
              isDragActive ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-500 cursor-pointer">
              {isDragActive
                ? "Déposez les images ici..."
                : "Faites glisser et déposez des images ici ou cliquez pour sélectionner des fichiers"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Images sélectionnées :</h4>
            <ul className="flex flex-wrap gap-2 mt-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-14 w-14 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs p-1"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p>
              épinglé <span className="text-red-500 text-sm">*</span>
            </p>
            <div className="flex flex-row gap-3 text-sm mt-2">
              <input type="checkbox" name="pinned" />
              <p>Marquer comme épinglé</p>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="mt-3 text-white rounded-md w-full h-12 bg-secondary"
      >
        {loading ? "Uploading..." : "Ajouter"}
      </button>
    </form>
  );
};

export default PublicationCreateForm;

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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isSpotlight, setIsSpotlight] = useState(false);
  const { accessToken } = useAuthStore();

  // Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle cover image selection
  const handleCoverFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setCoverFile(event.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    toast.loading("Un moment...", { id: "create" });

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const publicationData: PublicationCreateDto = {
      title: data.title as string,
      content: data.content as string,
      photos: [],
      pinned: !!data.pinned,
      spotlight: isSpotlight,
      coverUrl: coverUrl ?? "", // Set cover image URL
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

      // Upload cover image if spotlight is checked
      if (isSpotlight && coverFile) {
        const coverRef = ref(
          storage,
          `publications-cover/${Date.now()}_${coverFile.name}`
        );
        const coverUploadTask = uploadBytesResumable(coverRef, coverFile);

        const coverUrlPromise = new Promise<string>((resolve, reject) => {
          coverUploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(
                coverUploadTask.snapshot.ref
              );
              setCoverUrl(downloadURL);
              resolve(downloadURL);
            }
          );
        });

        publicationData.coverUrl = await coverUrlPromise;
      }

      // Send data to API
      const response = await fetch("/api/publications/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publicationData),
      });

      if (response.ok) {
        onClose();
        toast.success("Publication ajoutée avec succès");
      } else {
        toast.error("Échec de la création de la publication");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inconnue s'est produite.");
    } finally {
      toast.dismiss("create");
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

          <div className="w-full col-span-2 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Pinned Section */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="pinned"
                    className="h-4 w-4 accent-blue-500"
                  />
                  <span>Épinglé</span>
                </label>
                <p className="text-xs text-gray-600">
                  Marquer cette publication comme épinglée.
                </p>
              </div>

              {/* Spotlight Section */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="spotlight"
                    className="h-4 w-4 accent-blue-500"
                    onChange={(e) => setIsSpotlight(e.target.checked)}
                  />
                  <span>À la une</span>
                </label>
                <p className="text-xs text-gray-600">
                  Afficher cette publication en haut de la page d'accueil.
                </p>

                {/* Cover Image Upload (Only if Spotlight is Checked) */}
                {isSpotlight && (
                  <div className="mt-3 flex flex-col space-y-2">
                    <label className="text-sm font-medium">
                      Image de couverture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="border rounded p-2 text-sm bg-white cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                    />
                  </div>
                )}
              </div>
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

import { useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import { Department, JobLevel } from "@prisma/client";
import { EitherInput } from "@/common/components/atomic/EitherInput";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase";
import { useAuthStore } from "@/zustand/auth-store";
import toast from "react-hot-toast";
import { EmployeeCreateDto } from "../dtos/EmployeeCreateDto";

interface Props {
  departments: Department[];
  customerId: string; // Pass customerId as a prop or fetch it from context
}

export const EmployeeCreateForm = ({ departments, customerId }: Props) => {
  const { jobLevel } = useStaticValues();

  // State for form data and response
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    registration: "",
    photo: null as File | null,
    level: "",
    departmentId: departments.length > 0 ? departments[0].id : "",
    departmentName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? (e.target as HTMLInputElement).files?.[0] || null
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    toast.loading("Un moment...", { id: "create" });

    try {
      let photoUrl = "";

      // Upload photo to Firebase Storage if it exists
      if (formData.photo) {
        const storageRef = ref(
          storage,
          `employee-photos/${formData.photo.name}`
        );
        await uploadBytes(storageRef, formData.photo);
        photoUrl = await getDownloadURL(storageRef);
      }

      // Prepare the payload according to EmployeeCreateDto
      const payload: EmployeeCreateDto = {
        customerId, // Include customerId from props or context
        firstName: formData.firstName,
        lastName: formData.lastName,
        registration: formData.registration,
        email: formData.email,
        phone: formData.phone,
        departmentId: formData.departmentId || undefined, // Only include if departmentName is empty
        departmentName: formData.departmentName || undefined, // Only include if departmentId is empty
        level: formData.level as JobLevel, // Cast to JobLevel type
        photoUrl, // Include the photo URL from Firebase Storage
        fcmToken: "",
      };

      // Submit the payload to the API
      const response = await fetch("/api/employees/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) toast.error("An error occurred");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        registration: "",
        photo: null,
        level: "",
        departmentId: departments.length > 0 ? departments[0].id : "",
        departmentName: "",
      });
      toast.success("Employé ajouté avec succès !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      toast.dismiss("create");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="font-medium text-xl">Informations</h3>
      <div className="w-full">
        <div className="grid grid-cols-3 gap-4">
          <Input
            icon="IdentificationIcon"
            name="firstName"
            label="Prénom"
            placeholder="Prénom"
            initialValue={formData.firstName}
            onChange={handleChange}
          />
          <Input
            icon="IdentificationIcon"
            name="lastName"
            label="Nom"
            placeholder="Nom"
            initialValue={formData.lastName}
            onChange={handleChange}
          />
          <Input
            icon="EnvelopeIcon"
            name="email"
            label="Email"
            placeholder="Email"
            type="email"
            initialValue={formData.email}
            onChange={handleChange}
          />
          <Input
            icon="PhoneIcon"
            name="phone"
            label="Tel"
            placeholder="Tel"
            type="tel"
            initialValue={formData.phone}
            onChange={handleChange}
          />
          <Input
            icon="TagIcon"
            name="registration"
            label="Immatricule"
            placeholder="Immatricule"
            initialValue={formData.registration}
            onChange={handleChange}
          />
          <Input
            icon="PhotoIcon"
            name="photo"
            label="Photo"
            placeholder="Uploader une photo"
            type="file"
            accept="image"
            onChange={handleChange}
          />
          <Input
            icon="BriefcaseIcon"
            name="level"
            label="Poste"
            placeholder="Sélectionner le poste"
            type="select"
            className="col-span-3"
            options={jobLevel}
            initialValue={formData.level}
            onChange={handleChange}
          />
          <EitherInput
            className="col-span-3"
            initialActiveSide={departments.length > 0 ? "left" : "right"}
            unselectableSide={departments.length === 0 ? "left" : undefined}
            labels={["Département existant", "Nouveau département"]}
            nodes={[
              <Input
                key={0}
                icon="BuildingOfficeIcon"
                name="departmentId"
                placeholder="Choisir un département"
                type="select"
                options={departments.reduce(
                  (acc, { id, title }) => ({ ...acc, [id]: title }),
                  {}
                )}
                initialValue={formData.departmentId}
                onChange={handleChange}
              />,
              <Input
                key={1}
                name="departmentName"
                placeholder="Département"
                icon="BuildingOfficeIcon"
                initialValue={formData.departmentName}
                onChange={handleChange}
              />,
            ]}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          type="submit"
          className="bg-secondary w-full h-12 text-white px-4 py-2 rounded mt-3"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Créer Employé"}
        </button>
      </div>
    </form>
  );
};

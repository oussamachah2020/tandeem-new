import { FC, useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import { Department } from "@prisma/client";
import { EitherInput } from "@/common/components/atomic/EitherInput";
import { useStaticValues } from "@/common/context/StaticValuesContext";

interface Props {
  departments: Department[];
}

export const EmployeeCreateForm: FC<Props> = ({ departments }) => {
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
    setSuccess(null);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value as string | Blob);
      });

      const response = await fetch("/api/employees/create", {
        method: "POST",
        body: form,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "An error occurred");

      setSuccess("Employee created successfully!");
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Créer Employé"}
        </button>
      </div>
    </form>
  );
};

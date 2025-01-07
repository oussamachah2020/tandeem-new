import { FC, FormEvent, useState } from "react";
import { Input } from "@/common/components/atomic/Input";
import Button from "@/common/components/atomic/Button";
import employeeService from "@/domain/employees/services/EmployeeService";
import { EitherInput } from "@/common/components/atomic/EitherInput";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { ArrayElement } from "@/common/utils/types";
import { useAuthStore } from "@/zustand/auth-store";

interface Props {
  employee: ArrayElement<Awaited<ReturnType<typeof employeeService.getAll>>>;
  departments: Awaited<ReturnType<typeof employeeService.getDepartments>>;
  onClose: () => void;
}

export const EmployeeUpdateForm: FC<Props> = ({
  employee,
  departments,
  onClose,
}) => {
  const { jobLevel } = useStaticValues();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { accessToken, authenticatedUser } = useAuthStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.append("customerId", authenticatedUser?.customerId ?? "");

    try {
      // Make the API call using fetch
      const response = await fetch("/api/employees/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // No need to set headers for FormData, fetch handles it automatically
      });

      const data = await response.json(); // Parse the JSON response

      if (data.success) {
        setSuccess(true); // Show success message
      } else {
        setError(data.message || "Failed to update employee."); // Show error message
      }
    } catch (err) {
      setError("An error occurred while updating the employee."); // Handle network errors
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        name="employeeId"
        value={employee.id}
        type="text"
        className="hidden"
      />
      <input
        name="imageRef"
        value={employee.photo}
        type="text"
        className="hidden"
      />
      <div className="mb-6">
        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-xl">Informations</h3>
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4">
              <Input
                icon="IdentificationIcon"
                name="firstName"
                label="Prénom"
                placeholder="Prénom"
                initialValue={employee.firstName}
              />
              <Input
                icon="IdentificationIcon"
                name="lastName"
                label="Nom"
                placeholder="Nom"
                initialValue={employee.lastName}
              />
              <Input
                icon="EnvelopeIcon"
                label="Email"
                placeholder="Email"
                type="email"
                disabled
                required={false}
                initialValue={employee.user.email}
              />
              <Input
                icon="PhoneIcon"
                name="phone"
                label="Tel"
                placeholder="Tel"
                type="tel"
                initialValue={employee.phone}
              />
              <Input
                icon="TagIcon"
                name="registration"
                label="Immatricule"
                placeholder="Immatricule"
                initialValue={employee.registration}
              />
              <Input
                icon="PhotoIcon"
                name="photo"
                label="Photo"
                placeholder="Uploader une photo"
                type="file"
                accept="image"
                required={false}
              />
              <Input
                icon="BriefcaseIcon"
                name="level"
                label="Poste"
                placeholder="Selectionner le poste"
                type="select"
                className="col-span-3"
                options={jobLevel}
              />
              <EitherInput
                className="col-span-3"
                initialActiveSide="left"
                labels={["Département existant", "Nouveau département"]}
                nodes={[
                  <Input
                    icon="BuildingOfficeIcon"
                    name="departmentId"
                    placeholder="Choisir un departement"
                    type="select"
                    options={departments.reduce(
                      (acc, { id, title }) => ({ ...acc, [id]: title }),
                      {}
                    )}
                    selected={employee.departmentId}
                  />,
                  <Input
                    name="departmentName"
                    placeholder="Departement"
                    icon="BuildingOfficeIcon"
                  />,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && (
        <p className="text-green-500 mb-4">Employee updated successfully!</p>
      )}
      <Button
        fullWidth
        text={isSubmitting ? "Modifying..." : "Modifier"}
        icon="CheckIcon"
        type="submit"
        disabled={isSubmitting}
      />
    </form>
  );
};

import { FC, useMemo, useState } from "react";
import Datatable from "@/common/components/datatable/Datatable";
import adminService from "@/domain/admins/services/AdminService";
import { DatatableRow } from "@/common/components/datatable/DatatableRow";
import { DatatableValue } from "@/common/components/datatable/DatatableValue";
import { ImagePreview } from "@/common/components/global/ImagePreview";
import Label from "@/common/components/atomic/Label";
import { ArrayElement } from "@/common/utils/types";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import { useStaticValues } from "@/common/context/StaticValuesContext";

type SortField = "name" | "email" | "status";

interface Props {
  admins: Awaited<ReturnType<typeof adminService.getAll>>;
  onUpdate: (
    admin: ArrayElement<Awaited<ReturnType<typeof adminService.getAll>>>
  ) => void;
}

const AdminTable: FC<Props> = ({ admins, onUpdate }) => {
  const { label, action, confirmation, tooltip } = useStaticValues();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      // Set new field and default to ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedAdmins = useMemo(() => {
    if (admins.length) {
      return [...admins].sort((a, b) => {
        const aValue = (a?.name || "").toString().toLowerCase();
        const bValue = (b?.name || "").toString().toLowerCase();

        if (sortField === "name") {
          // Always sort by name in ascending order
          return aValue.localeCompare(bValue);
        }

        if (sortOrder === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }
  }, [sortField, sortOrder, admins]);

  return (
    <Datatable
      isEmpty={sortedAdmins?.length === 0}
      headers={[label.name, label.email, label.status]}
      onSortChange={(headerIndex) => {
        const fields: SortField[] = ["name", "email", "status"];
        handleSortChange(fields[headerIndex]);
      }}
    >
      {sortedAdmins && sortedAdmins.length
        ? sortedAdmins?.map((admin, idx) => (
            <DatatableRow
              key={idx}
              onUpdate={() => onUpdate(admin)}
              onDelete={{
                action: "/api/admins/delete",
                resourceId: admin.id,
                resourceRefs: [admin.photo],
                message: confirmation.adminDelete,
              }}
              actionButtons={
                <>
                  <ConfirmableActionButton
                    action="/api/admins/reset-password"
                    resourceId={admin.id}
                    template={{ icon: "ArrowPathIcon", text: action.reset }}
                    message={confirmation.adminResetPassword}
                    tooltip={tooltip.adminResetPassword}
                  />
                  {admin.user.isActive ? (
                    <ConfirmableActionButton
                      action="/api/admins/suspend"
                      resourceId={admin.id}
                      template={{
                        icon: "LockClosedIcon",
                        text: action.suspend,
                      }}
                      message={confirmation.adminSuspendAccount}
                      tooltip={tooltip.adminSuspendAccount}
                    />
                  ) : (
                    <ConfirmableActionButton
                      action="/api/admins/reactivate"
                      resourceId={admin.id}
                      template={{
                        icon: "LockOpenIcon",
                        text: action.reactivate,
                      }}
                      message={confirmation.adminReactivateAccount}
                      tooltip={tooltip.adminReactivateAccount}
                    />
                  )}
                </>
              }
            >
              <DatatableValue className="flex items-center gap-5">
                <ImagePreview imageRef={admin.photo} />
                {admin.name}
              </DatatableValue>
              <DatatableValue>{admin.user.email}</DatatableValue>
              <DatatableValue>
                <Label
                  textColor={
                    admin.user.isActive ? "text-green-500" : "text-red-600"
                  }
                >
                  {admin.user.isActive ? label.active : label.suspended}
                </Label>
              </DatatableValue>
            </DatatableRow>
          ))
        : null}
    </Datatable>
  );
};

export default AdminTable;

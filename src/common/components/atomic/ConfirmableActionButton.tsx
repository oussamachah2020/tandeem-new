import {FC, ReactNode, useMemo, useState} from "react";
import ActionButton from "@/common/components/atomic/ActionButton";
import {Modal} from "@/common/components/global/Modal";
import * as Icons from '@heroicons/react/24/outline'
import {useStaticValues} from "@/common/context/StaticValuesContext";
import Form from "@/common/components/global/Form";
import Button from "./Button";
import { TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/zustand/auth-store";

interface Props {
  message: ReactNode | string;
  action: string;
  resourceId: string;
  resourceRefs?: string[];
  template: "DELETE" | { icon: keyof typeof Icons; text: string };
  tooltip?: string;
}

const ConfirmableActionButton: FC<Props> = ({
  action,
  template,
  tooltip,
  message,
  resourceId,
  resourceRefs,
}) => {
  const { confirmation } = useStaticValues();
  const [isConfirmationModalShown, setIsConfirmationModalShown] =
    useState(false);
  const { accessToken } = useAuthStore();
  const { icon, hoverColor } = useMemo<{
    icon: keyof typeof Icons;
    hoverColor: string;
  }>(() => {
    return template === "DELETE"
      ? { icon: "TrashIcon", hoverColor: "hover:bg-red-200" }
      : { ...template, hoverColor: "hover:bg-gray-200" };
  }, [template]);

  async function handleAction() {
    toast.loading("Un moment...", { id: "delete" });
    try {
      const response = await fetch(action, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: resourceId }),
      });

      if (response.ok) {
        toast.success("data supprimé avec succès");
      }
    } catch (error) {
      console.error(error);
    } finally {
      toast.dismiss("delete");
    }
  }

  return (
    <>
      <ActionButton
        icon={icon}
        hoverColor={hoverColor}
        onClick={() => setIsConfirmationModalShown(true)}
        tooltip={tooltip}
      />
      <Modal
        title={confirmation.areYouSure}
        isShown={isConfirmationModalShown}
        onClose={() => setIsConfirmationModalShown(false)}
        // width="w-1/2"
      >
        <div className="flex flex-col gap-4">
          <div className="text-[1rem] whitespace-pre-line leading-relaxed">
            {message}
          </div>
          <hr className="border-0 border-b" />
          <button
            onClick={handleAction}
            className="w-full bg-red-500 h-12 rounded-md text-white  flex flex-row justify-center items-center gap-3"
          >
            <TrashIcon className="h-5 w-5 text-white" />
            Supprimer
          </button>
          {/* {resourceRefs?.map((ref, idx) => (
                  <input key={idx} name="refs" value={ref} className="hidden" />
                ))} */}
          {/* <Form action={action} template={template}>
                            <input
                                name='id'
                                value={resourceId}
                                type='text'
                                className='hidden'
                            />
                            {resourceRefs?.map((ref, idx) => (
                                <input
                                    key={idx}
                                    name='refs'
                                    value={ref}
                                    className='hidden'
                                />
                            ))}
                        </Form> */}
        </div>
      </Modal>
    </>
  );
};
;

export default ConfirmableActionButton
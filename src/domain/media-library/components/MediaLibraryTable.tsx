import {FC} from "react";
import Datatable from "@/common/components/datatable/Datatable";
import {DatatableRow} from "@/common/components/datatable/DatatableRow";
import {DatatableValue} from "@/common/components/datatable/DatatableValue";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";
import {ArrayElement} from "@/common/utils/types";
import ActionButton from "@/common/components/atomic/ActionButton";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    mediaLibrary: Awaited<ReturnType<typeof mediaLibraryService.getAll>>
    onUpdate?: (media: ArrayElement<Awaited<ReturnType<typeof mediaLibraryService.getAll>>>) => void
    canDelete?: false
}

const MediaLibraryTable: FC<Props> = ({
  mediaLibrary = [],
  onUpdate,
  canDelete,
}) => {
  const { confirmation } = useStaticValues();
  return (
    <Datatable
      isEmpty={mediaLibrary.length === 0}
      headers={["Titre", "Description"]}
    >
      {mediaLibrary.map((media, idx) => (
        <DatatableRow
          key={idx}
          onUpdate={onUpdate ? () => onUpdate(media) : undefined}
          onDelete={
            canDelete === undefined
              ? {
                  action: "/api/media-library/delete",
                  resourceId: media.id,
                  message: confirmation.mediaDelete,
                }
              : undefined
          }
          actionButtons={
            <ActionButton
              icon="ArrowTopRightOnSquareIcon"
              onClick={() => window.open(media.url, "_blank")}
              tooltip="Ouvrir le lien"
            />
          }
        >
          <DatatableValue className="w-1/4">{media.title}</DatatableValue>
          <DatatableValue className="w-3/4 text-sm leading-relaxed">
            {media.description}
          </DatatableValue>
        </DatatableRow>
      ))}
    </Datatable>
  );
};

export default MediaLibraryTable
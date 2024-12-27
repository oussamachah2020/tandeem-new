import {FC} from "react";
import ActionButton from "@/common/components/atomic/ActionButton";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import {CheckIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {formatDate} from "@/common/utils/functions";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import {ArrayElement} from "@/common/utils/types";
import publicationService from "@/domain/publications/services/PublicationService";

interface Props {
    publication: ArrayElement<Awaited<ReturnType<typeof publicationService.getAll>>>
    onUpdate: () => void
}

const PublicationCard: FC<Props> = ({ publication, onUpdate }) => (
  <div className="flex flex-col h-full gap-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className="col-span-2 flex flex-col gap-5">
      <img
        className="border rounded-md w-full h-64 object-cover"
        src={
          publication?.photos.length === 0
            ? "https://www.angiil.com/wp-content/uploads/2021/11/Pub-e1637242285887.png"
            : publication.photos[0]
        }
        alt="photo"
      />
    </div>

    <div className="col-span-3 flex flex-col gap-4">
      <div className="w-full flex justify-between items-start">
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-lg font-semibold truncate text-gray-800">
            {publication.title}
          </h2>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {publication.pinned ? (
                <CheckIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              )}
              <span>{publication.pinned ? "Épinglé" : "Non Épinglé"}</span>
            </div>
            <div className="h-5 w-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span>Créé :</span>
              <span className="font-medium text-blue-600">
                {formatDate(publication.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 lg:flex-row">
          <ActionButton
            icon="PencilSquareIcon"
            hoverColor="hover:bg-blue-100"
            onClick={onUpdate}
          />
          <ConfirmableActionButton
            action="/api/publications/delete"
            resourceId={publication.id}
            template="DELETE"
            message=""
          />
        </div>
      </div>
    </div>
    <div className="w-full overflow-hidden flex flex-wrap rounded-lg">
      <p className="text-sm w-full text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
        {publication.content}
      </p>
    </div>
  </div>
);

export default PublicationCard
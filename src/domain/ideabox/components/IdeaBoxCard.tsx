import ideaBoxService from "@/domain/ideabox/services/IdeaBoxService";
import {FC} from "react";
import {ArrayElement} from "@/common/utils/types";
import {formatDate, getDownloadUrl} from "@/common/utils/functions";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    idea: ArrayElement<Awaited<ReturnType<typeof ideaBoxService.getAll>>>
}

const IdeaBoxCard: FC<Props> = ({idea}) => {
    const {action, confirmation} = useStaticValues()
    return (
        <div className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-3'>
            <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                    <img
                        src={getDownloadUrl(idea.employee.photo)}
                        alt={`${idea.employee.firstName} ${idea.employee.lastName} Photo`}
                        className='rounded-xl w-16 h-16 object-contain border-2'
                    />
                    <div className='flex flex-col gap-1'>
                        <div className='font-medium'>
                            {`${idea.employee.firstName} ${idea.employee.lastName}`}
                        </div>
                        <div className='text-sm text-gray-500'>
                            {formatDate(idea.createdAt)}
                        </div>
                    </div>
                </div>
                <ConfirmableActionButton
                    message={confirmation.ideaBoxArchive}
                    action='/api/idea-box/archive'
                    resourceId={idea.id}
                    template={{icon: 'ArchiveBoxArrowDownIcon', text: action.archive}}
                />
            </div>
            <div className='flex flex-col gap-1'>
                <div className='text-lg text-primary font-medium'>
                    {idea.title}
                </div>
                <div className='text-sm leading-loose'>
                    {idea.description}
                </div>
            </div>
        </div>
    );
};

export default IdeaBoxCard;
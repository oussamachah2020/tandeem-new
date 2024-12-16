import {ArrowRightIcon} from "@heroicons/react/24/outline";
import ContractStatus from "@/domain/contracts/components/ContractStatus";
import {formatDate} from "@/common/utils/functions";
import {Customer, Partner} from "@prisma/client";
import {FC, useMemo} from "react";
import ActionButton from "@/common/components/atomic/ActionButton";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import {ArrayElement} from "@/common/utils/types";
import contractService from "@/domain/contracts/services/ContractService";

interface Props {
    contract: ArrayElement<Awaited<ReturnType<typeof contractService.getAll>>>
    onClick: () => void
    onUpdate: () => void
}

const ContractCard: FC<Props> = ({contract, onClick, onUpdate}) => {
    const contractor: Partner | Customer = useMemo(() => contract.partner ?? contract.customer!, [contract.partner, contract.customer])

    return (
        <div
            className='flex items-center gap-6 bg-white rounded-lg p-6 border cursor-pointer box-border hover:bg-gray-50 transition duration-200'
            onClick={onClick}>
            <ImagePreview imageRef={contractor.logo} width='w-28' aspectRatio='aspect-square'/>
            <div className='flex flex-grow flex-col gap-3'>
                <div className='w-full flex justify-between items-center'>
                    <div className='text-lg font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]'>
                        {contractor.name}
                    </div>
                    <ActionButton icon='PencilSquareIcon' hoverColor='hover:bg-sky-200' onClick={onUpdate}/>
                </div>
                <div className='flex items-center gap-3'>
                    <div>{formatDate(contract.from)}</div>
                    <ArrowRightIcon className='w-4 h-4'/>
                    <div>{formatDate(contract.to)}</div>
                </div>
                <div>
                    <ContractStatus status={contract.status}/>
                </div>
            </div>
        </div>
    )
}

export default ContractCard
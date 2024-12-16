import Link from "@/common/components/atomic/Link";
import {ArrowRightIcon, EyeIcon} from "@heroicons/react/24/outline";
import ContractStatus from "@/domain/contracts/components/ContractStatus";
import {FC} from "react";
import {formatDate, getDownloadUrl} from "@/common/utils/functions";
import { Contract } from "@prisma/client";
import DetailsSection from "@/common/components/details-table/DetailsSection";
import DetailsRow from "@/common/components/details-table/DetailsRow";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    contract: Contract
}

const ContractDetails: FC<Props> = ({contract}) => {
    const {label} = useStaticValues()
    return (
        <DetailsSection title={label.contract}>
            <DetailsRow title={label.scan}>
                <Link href={getDownloadUrl(contract.scan)}>
                    <EyeIcon className='w-5 h-5'/>
                </Link>
            </DetailsRow>
            <DetailsRow title={label.status}>
                <ContractStatus status={contract.status}/>
            </DetailsRow>
            <DetailsRow
                title={label.validity}
                classname='flex items-center gap-3'
            >
                {formatDate(contract.from)}
                <ArrowRightIcon className='w-4 h-4'/>
                {formatDate(contract.prematureTo ?? contract.to)}
                {contract.prematureTo && (
                    <div className='line-through decoration-secondary text-gray-400'>
                        {formatDate(contract.to)}
                    </div>
                )}
            </DetailsRow>
        </DetailsSection>
    )
}


export default ContractDetails

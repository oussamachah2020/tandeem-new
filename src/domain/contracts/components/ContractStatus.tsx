import {FC, useMemo} from "react";
import Label from "@/common/components/atomic/Label";
import { ContractStatusName } from "@prisma/client";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    status: ContractStatusName
}

const ContractStatus: FC<Props> = ({status}) => {
    const {contractStatus} = useStaticValues()
    const textColor = useMemo(() => {
        if (status === ContractStatusName.Active) return 'text-green-600'
        else if (status === ContractStatusName.SoonToBeTerminated || status === ContractStatusName.SoonToBeEnded) return 'text-secondary'
        else if (status === ContractStatusName.Terminated || status === ContractStatusName.Ended) return 'text-red-600'
    }, [status])
    return (
        <Label textColor={textColor}>
            {contractStatus[status]}
        </Label>
    )
}

export default ContractStatus
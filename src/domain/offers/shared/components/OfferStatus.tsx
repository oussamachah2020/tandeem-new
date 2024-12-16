import {FC} from "react";
import Label from "@/common/components/atomic/Label";
import {OfferStatusName} from "@prisma/client";
import {offerStatuses} from "@/common/utils/statics";

interface Props {
    status: OfferStatusName
}

const OfferStatus: FC<Props> = ({status}) =>
    <Label textColor={status === OfferStatusName.Active ? 'text-green-500' : 'text-red-500'}>
        {offerStatuses[status]}
    </Label>

export default OfferStatus
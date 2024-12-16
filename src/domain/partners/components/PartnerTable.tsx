import {FC} from "react";
import Datatable from "@/common/components/datatable/Datatable";
import ContractStatus from "@/domain/contracts/components/ContractStatus";
import Label from "@/common/components/atomic/Label";
import partnerService from "@/domain/partners/services/PartnerService";
import {DatatableRow} from "@/common/components/datatable/DatatableRow";
import {DatatableValue} from "@/common/components/datatable/DatatableValue";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    partners: Awaited<ReturnType<typeof partnerService.getAllIncludeOffers>>
    onClick: (partner: any) => void
    onUpdate: (partner: any) => void
}

const PartnerTable: FC<Props> = ({partners, onUpdate, onClick}) => {
    const {label, category, paymentMethod, confirmation} = useStaticValues()
    return (
        <Datatable
            headers={[
                label.companyName,
                label.address,
                label.category,
                label.paymentMethod,
                label.contract
            ]}
            isEmpty={partners.length === 0}
        >
            {partners.map((partner, idx) =>
                <DatatableRow
                    key={idx}
                    onClick={() => onClick(partner)}
                    onUpdate={() => onUpdate(partner)}
                    onDelete={{
                        action: '/api/partners/delete',
                        resourceId: partner.id,
                        message: confirmation.partnerDelete
                    }}>
                    <DatatableValue className='flex items-center gap-5'>
                        <ImagePreview imageRef={partner.logo}/>
                        {partner.name}
                    </DatatableValue>
                    <DatatableValue>
                        {partner.address}
                    </DatatableValue>
                    <DatatableValue>
                        <Label>
                            {category[partner.category]}
                        </Label>
                    </DatatableValue>
                    <DatatableValue>
                        <Label>
                            {paymentMethod[partner.accepts as never]}
                        </Label>
                    </DatatableValue>
                    <DatatableValue>
                        <ContractStatus status={partner.contract.status}/>
                    </DatatableValue>
                </DatatableRow>
            )}
        </Datatable>
    )
}

export default PartnerTable
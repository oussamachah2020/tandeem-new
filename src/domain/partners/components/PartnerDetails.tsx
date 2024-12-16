import {FC} from "react";
import Link from "@/common/components/atomic/Link";
import ContractDetails from "@/domain/contracts/components/ContractDetails";
import {formatPhoneNumber, formatUrl, getDownloadUrl} from "@/common/utils/functions";
import Label from "@/common/components/atomic/Label";
import partnerService from "@/domain/partners/services/PartnerService";
import DetailsTable from "@/common/components/details-table/DetailsTable";
import DetailsSection from "@/common/components/details-table/DetailsSection";
import DetailsRow from "@/common/components/details-table/DetailsRow";
import {ArrayElement} from "@/common/utils/types";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    partner: ArrayElement<Awaited<ReturnType<typeof partnerService.getAll>>>
}

const PartnerDetails: FC<Props> = ({partner}) => {
    const {label, category, paymentMethod} = useStaticValues()
    return (
        <div className='flex gap-10'>
            <div className='bg-white p-1 w-28 h-28 border rounded-lg'>
                <img
                    className='w-full h-full object-contain'
                    src={getDownloadUrl(partner.logo)}
                    alt={`${partner.name} Logo`}
                />
            </div>
            <div className='flex-grow flex flex-col gap-6'>
                <div className='flex flex-col gap-3'>
                    <DetailsTable>
                        <DetailsSection title={label.information}>
                            <DetailsRow title={label.companyName}>
                                {partner.name}
                            </DetailsRow>
                            <DetailsRow title={label.address}>
                                {partner.address}
                            </DetailsRow>
                            <DetailsRow title={label.category}>
                                <Label>
                                    {category[partner.category]}
                                </Label>
                            </DetailsRow>
                            <DetailsRow title={label.website}>
                                <Link href={partner.website} className='flex items-center gap-1'>
                                    {formatUrl(partner.website)}
                                </Link>
                            </DetailsRow>
                            <DetailsRow title={label.paymentMethod}>
                                <Label>
                                    {paymentMethod[partner.accepts as never]}
                                </Label>
                            </DetailsRow>
                        </DetailsSection>
                        <ContractDetails contract={partner.contract}/>
                        <DetailsSection title={label.representative}>
                            <DetailsRow title={label.name}>
                                {partner.representative.fullName}
                            </DetailsRow>
                            <DetailsRow title={label.email}>
                                <Link href={`mailto:${partner.representative.email}`}>
                                    {partner.representative.email}
                                </Link>
                            </DetailsRow>
                            <DetailsRow title={label.phone}>
                                {formatPhoneNumber(partner.representative.phone)}
                            </DetailsRow>
                        </DetailsSection>
                    </DetailsTable>
                </div>
            </div>
        </div>
    )
}

export default PartnerDetails
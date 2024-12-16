import {FC} from "react";
import Link from "@/common/components/atomic/Link";
import ContractDetails from "@/domain/contracts/components/ContractDetails";
import {formatPhoneNumber, formatUrl, getDownloadUrl} from "@/common/utils/functions";
import customerService from "@/domain/customers/services/CustomerService";
import Label from "@/common/components/atomic/Label";
import DetailsTable from "@/common/components/details-table/DetailsTable";
import DetailsSection from "@/common/components/details-table/DetailsSection";
import DetailsRow from "@/common/components/details-table/DetailsRow";
import {ArrayElement} from "@/common/utils/types";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    customer: ArrayElement<Awaited<ReturnType<typeof customerService.getAll>>>
}

const CustomerDetails: FC<Props> = ({customer}) => {
    const {label, category} = useStaticValues()
    return (
        <div className='flex gap-10'>
            <div className='bg-white p-1 w-28 h-28 border rounded-lg'>
                <img
                    className='w-full h-full object-contain'
                    src={getDownloadUrl(customer.logo)}
                    alt={`${customer.name} Logo`}
                />
            </div>
            <div className='flex-grow flex flex-col gap-6'>
                <div className='flex flex-col gap-3'>
                    <DetailsTable>
                        <DetailsSection title={label.information}>
                            <DetailsRow title={label.companyName}>
                                {customer.name}
                            </DetailsRow>
                            <DetailsRow title={label.address}>
                                {customer.address}
                            </DetailsRow>
                            <DetailsRow title={label.category}>
                                <Label>
                                    {category[customer.category]}
                                </Label>
                            </DetailsRow>
                            <DetailsRow title={label.email}>
                                <Link href={`mailto:${customer.users[0].email}`}>
                                    {customer.users[0].email}
                                </Link>
                            </DetailsRow>
                            <DetailsRow title={label.website}>
                                <Link href={customer.website}>
                                    {formatUrl(customer.website)}
                                </Link>
                            </DetailsRow>
                        </DetailsSection>
                        <DetailsSection title={label.conditions}>
                            <DetailsRow title={label.maxNumberOfEmployees}>
                                {customer.maxEmployees}
                            </DetailsRow>
                        </DetailsSection>
                        <ContractDetails contract={customer.contract}/>
                        <DetailsSection title={label.representative}>
                            <DetailsRow title={label.name}>
                                {customer.representative.fullName}
                            </DetailsRow>
                            <DetailsRow title={label.email}>
                                <Link href={`mailto:${customer.representative.email}`}>
                                    {customer.representative.email}
                                </Link>
                            </DetailsRow>
                            <DetailsRow title={label.phone}>
                                {formatPhoneNumber(customer.representative.phone)}
                            </DetailsRow>
                        </DetailsSection>
                    </DetailsTable>
                </div>
            </div>
        </div>
    )
}

export default CustomerDetails
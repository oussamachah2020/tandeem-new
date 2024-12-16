import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {Modal} from "@/common/components/global/Modal";
import {CustomerCreateForm} from "@/domain/customers/components/CustomerCreateForm";
import CustomerTable from "@/domain/customers/components/CustomerTable";
import CustomerDetails from "@/domain/customers/components/CustomerDetails";
import customerService from "@/domain/customers/services/CustomerService";
import useSearch from "@/common/hooks/UseSearch";
import ActionBar from "@/common/components/global/ActionBar";
import {CustomerUpdateForm} from "@/domain/customers/components/CustomerUpdateForm";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import useFilter from "@/common/hooks/UseFilter";
import {AuthenticatedUser} from "@/common/services/AuthService";
import useModal from "@/common/hooks/UseModal";
import {getToken} from "next-auth/jwt";
import {labeledContractStatuses} from "@/common/utils/statics";
import {md5Hash} from "@/common/utils/functions";
import {ArrayElement} from "@/common/utils/types";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    user: AuthenticatedUser
    customers: Awaited<ReturnType<typeof customerService.getAll>>
}

const Customers: NextPage<Props> = ({user, customers}) => {
    const {category} = useStaticValues()
    const {action, label} = useStaticValues()
    const [, isAddCustomerModalShown, toggleAddCustomerModal] = useModal(false)
    const [customerToShow, isCustomerModalShown, toggleCustomerModal] = useModal<ArrayElement<typeof customers>>()
    const [customerToUpdate, isEditCustomerModalShown, toggleEditCustomerModal] = useModal<ArrayElement<typeof customers>>()

    const [searchResultedCustomers, onSearchInputChange] = useSearch(customers, ['name', 'address'])
    const [filteredCustomers, onFilterValueChange] = useFilter(searchResultedCustomers, ['category', 'contract.status' as any])

    return (
        <>
            <Main section={SectionName.Customers} user={user}>
                <ActionBar
                    action={{
                        text: action.customerAdd,
                        onClick: () => toggleAddCustomerModal(true)
                    }}
                    onSearchInputChange={onSearchInputChange}
                />
                <FilterGroup>
                    <Filter
                        label={label.category}
                        icon='SwatchIcon'
                        values={Object.entries(category)}
                        onValueChange={(e: any) => onFilterValueChange('category', e)}
                    />
                    <Filter
                        label={label.contract}
                        icon='ArrowPathIcon'
                        values={labeledContractStatuses}
                        onValueChange={(e: any) => onFilterValueChange('contract.status' as any, e)}
                    />
                </FilterGroup>
                <CustomerTable
                    customers={filteredCustomers}
                    onClick={(customer: any) => toggleCustomerModal(true, customer)}
                    onUpdate={(customer: any) => toggleEditCustomerModal(true, customer)}
                />
            </Main>
            <Modal
                title={action.customerAdd}
                isShown={isAddCustomerModalShown}
                onClose={() => toggleAddCustomerModal(false)}
            >
                <CustomerCreateForm/>
            </Modal>
            <Modal
                title={action.customerUpdate}
                isShown={isEditCustomerModalShown}
                onClose={() => toggleEditCustomerModal(false)}
            >
                {customerToUpdate && <CustomerUpdateForm customer={customerToUpdate}/>}
            </Modal>
            <Modal
                title={action.customerDetail}
                isShown={isCustomerModalShown}
                onClose={() => toggleCustomerModal(false)}
            >
                {customerToShow && <CustomerDetails customer={customerToShow}/>}
            </Modal>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser;
    const customers = await customerService.getAll()

    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            customers: JSON.parse(JSON.stringify(customers))
        }
    }

    return result
}

export default Customers;

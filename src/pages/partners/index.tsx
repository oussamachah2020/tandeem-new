import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {Modal} from "@/common/components/global/Modal";
import PartnerTable from "@/domain/partners/components/PartnerTable";
import {PartnerCreateForm} from "@/domain/partners/components/PartnerCreateForm";
import partnerService from "@/domain/partners/services/PartnerService";
import PartnerDetails from "@/domain/partners/components/PartnerDetails";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import {PartnerUpdateForm} from "@/domain/partners/components/PartnerUpdateForm";
import Filter from "@/common/components/filter/Filter";
import FilterGroup from "@/common/components/filter/FilterGroup";
import useFilter from "@/common/hooks/UseFilter";
import {AuthenticatedUser} from "@/common/services/AuthService";
import useModal from "@/common/hooks/UseModal";
import {getToken} from "next-auth/jwt";
import {labeledContractStatuses, labeledPaymentMethods} from "@/common/utils/statics";
import {ArrayElement} from "@/common/utils/types";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    user: AuthenticatedUser
    partners: Awaited<ReturnType<typeof partnerService.getAllIncludeOffers>>
}

const Partners: NextPage<Props> = ({user, partners}) => {
    const {label, action, category} = useStaticValues()
    const [, isAddPartnerModalShown, toggleAddPartnerModal] = useModal(false)
    const [partnerToShow, isPartnerModalShown, togglePartnerModal] = useModal<ArrayElement<typeof partners>>()
    const [partnerToUpdate, isEditPartnerModalShown, toggleEditPartnerModal] = useModal<ArrayElement<typeof partners>>()

    const [searchResultedPartners, onSearchInputChange] = useSearch(partners, ['name', 'address'])
    const [filteredPartners, onFilterValueChange] = useFilter(searchResultedPartners, ['category', 'contract.status' as any, 'accepts'])

    return <>
        <Main section={SectionName.Partners} user={user}>
            <ActionBar
                action={{
                    text: action.partnerAdd,
                    onClick: () => toggleAddPartnerModal(true)
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
                <Filter
                    label={label.paymentMethod}
                    icon='CreditCardIcon'
                    values={labeledPaymentMethods}
                    onValueChange={(e: any) => onFilterValueChange('accepts', e)}
                />
            </FilterGroup>
            <PartnerTable
                partners={filteredPartners}
                onClick={(partner: any) => togglePartnerModal(true, partner)}
                onUpdate={(partner: any) => toggleEditPartnerModal(true, partner)}
            />
        </Main>
        <Modal
            title={action.partnerAdd}
            isShown={isAddPartnerModalShown}
            onClose={() => toggleAddPartnerModal(false)}
        >
            <PartnerCreateForm/>
        </Modal>
        <Modal
            title={action.partnerUpdate}
            isShown={isEditPartnerModalShown}
            onClose={() => toggleEditPartnerModal(false)}
        >
            {partnerToUpdate && <PartnerUpdateForm partner={partnerToUpdate}/>}
        </Modal>
        <Modal
            title={action.partnerDetail}
            isShown={isPartnerModalShown}
            onClose={() => togglePartnerModal(false)}
        >
            {partnerToShow && <PartnerDetails partner={partnerToShow}/>}
        </Modal>
    </>;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser;
    const partners = await partnerService.getAllIncludeOffers()
    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            partners: JSON.parse(JSON.stringify(partners))
        }
    }

    return result
}

export default Partners;

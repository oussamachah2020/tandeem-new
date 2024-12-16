import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {getToken} from "next-auth/jwt";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import useModal from "@/common/hooks/UseModal";
import AdminTable from "@/domain/admins/components/AdminTable";
import adminService from "@/domain/admins/services/AdminService";
import {Modal} from "@/common/components/global/Modal";
import AdminCreateForm from "@/domain/admins/components/AdminCreateForm";
import useFilter from "@/common/hooks/UseFilter";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import {ArrayElement} from "@/common/utils/types";
import AdminUpdateForm from "@/domain/admins/components/AdminUpdateForm";
import {md5Hash} from "@/common/utils/functions";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    user: AuthenticatedUser;
    admins: Awaited<ReturnType<typeof adminService.getAll>>
}

const Admins: NextPage<Props> = ({user, admins}) => {
    const {label, action} = useStaticValues()
    const [searchResultedAdmins, onSearchInputChange] = useSearch(admins, ['name', 'user.email' as any])
    const [filteredResults, onFilterValueChange] = useFilter(searchResultedAdmins, ['user.isActive' as any])
    const [, isAddAdminModalShown, toggleAddAdminModal] = useModal(false)
    const [adminToUpdate, isUpdateAdminModalShown, toggleAdminUpdateModal] = useModal<ArrayElement<typeof admins>>()

    return (
        <Main section={SectionName.Admins} user={user}>
            <ActionBar
                onSearchInputChange={onSearchInputChange}
                action={{
                    text: action.adminAdd,
                    onClick: () => toggleAddAdminModal(true)
                }}
            />
            <FilterGroup>
                <Filter
                    icon='ArrowPathIcon'
                    label={label.status}
                    values={[['true', 'Actif'], ['false', 'Suspendu']]}
                    onValueChange={(event) => onFilterValueChange('user.isActive' as any, event)}
                />
            </FilterGroup>
            <AdminTable
                admins={filteredResults}
                onUpdate={(admin) => toggleAdminUpdateModal(true, admin)}
            />
            <Modal
                title={action.adminAdd}
                isShown={isAddAdminModalShown}
                onClose={() => toggleAddAdminModal(false)}
            >
                <AdminCreateForm/>
            </Modal>
            <Modal
                title={action.adminUpdate}
                isShown={isUpdateAdminModalShown}
                onClose={() => toggleAdminUpdateModal(false)}
            >
                <AdminUpdateForm admin={adminToUpdate}/>
            </Modal>
        </Main>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser;
    const admins = await adminService.getAll(user.customer?.id)

    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            admins: JSON.parse(JSON.stringify(admins))
        },
    };

    return result;
};

export default Admins;

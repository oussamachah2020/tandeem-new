import {Main} from "@/common/components/global/Main";
import {ChangeEvent} from "react";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult, NextPage} from "next";
import {Modal} from "@/common/components/global/Modal";
import useSearch from "@/common/hooks/UseSearch";
import ActionBar from "@/common/components/global/ActionBar";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import useFilter from "@/common/hooks/UseFilter";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {EmployeeCreateForm} from "@/domain/employees/components/EmployeeCreateForm";
import EmployeeTable from "@/domain/employees/components/EmployeeTable";
import {getToken} from "next-auth/jwt";
import useModal from "@/common/hooks/UseModal";
import employeeService from "@/domain/employees/services/EmployeeService";

import {labeledJobLevels} from "@/common/utils/statics";
import {EmployeeUpdateForm} from "@/domain/employees/components/EmployeeUpdateForm";
import EmployeeDetails from "@/domain/employees/components/EmployeeDetails";
import {md5Hash} from "@/common/utils/functions";
import {ArrayElement} from "@/common/utils/types";

interface Props {
    user: AuthenticatedUser
    employees: Awaited<ReturnType<typeof employeeService.getAll>>
    departments: Awaited<ReturnType<typeof employeeService.getDepartments>>
}

const EmployeesPage: NextPage<Props> = ({user, employees, departments}) => {
    const [, isAddEmployeeModalShown, setIsAddEmployeeModalShown] = useModal(false)
    const [employeeToUpdate, isEditEmployeeModalShown, setIsEditEmployeeModalShown] = useModal<ArrayElement<typeof employees>>()
    const [employeeToShow, isEmployeeModalShown, setIsEmployeeModalShown] = useModal<ArrayElement<typeof employees>>()

    const [searchResultedEmployees, onSearchInputChange] = useSearch(employees, ['firstName', 'lastName', 'registration'])
    const [filteredEmployees, onFilterValueChange] = useFilter(searchResultedEmployees, ['department.id' as any, 'level'])

    return (
        <>
            <Main section={SectionName.Employees} user={user}>
                <ActionBar action={{text: 'Ajouter un salarié', onClick: () => setIsAddEmployeeModalShown(true)}}
                           onSearchInputChange={onSearchInputChange}/>
                <FilterGroup>
                    <Filter
                        label='Departement'
                        icon='BuildingOfficeIcon'
                        values={departments.map(({id, title}) => [id, title])}
                        onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('department.id' as any, e)}
                    />
                    <Filter
                        label='Poste'
                        icon='BriefcaseIcon'
                        values={labeledJobLevels}
                        onValueChange={(e: ChangeEvent<HTMLSelectElement>) => onFilterValueChange('level', e)}
                    />
                </FilterGroup>
                <EmployeeTable
                    employees={filteredEmployees}
                    onClick={(employee: any) => setIsEmployeeModalShown(true, employee)}
                    onUpdate={(employee: any) => setIsEditEmployeeModalShown(true, employee)}
                />
            </Main>
            <Modal title='Ajouter un salarié' isShown={isAddEmployeeModalShown}
                   onClose={() => setIsAddEmployeeModalShown(false)}>
                <EmployeeCreateForm departments={departments}/>
            </Modal>
            <Modal title='Modifier le salarié' isShown={isEditEmployeeModalShown}
                   onClose={() => setIsEditEmployeeModalShown(false)}>
                <EmployeeUpdateForm employee={employeeToUpdate} departments={departments}/>
            </Modal>
            <Modal title='Détails du salarié' isShown={isEmployeeModalShown}
                   onClose={() => setIsEmployeeModalShown(false)}>
                <EmployeeDetails employee={employeeToShow}/>
            </Modal>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser;

    const {id: customerId} = user.customer!

    const employees = await employeeService.getAll(customerId)
    const departments = await employeeService.getDepartments(customerId)

    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            employees: JSON.parse(JSON.stringify(employees)),
            departments: JSON.parse(JSON.stringify(departments))
        }
    }

    return result
}

export default EmployeesPage;

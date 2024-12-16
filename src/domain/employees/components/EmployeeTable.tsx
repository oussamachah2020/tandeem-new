import {FC} from "react";
import Datatable from "@/common/components/datatable/Datatable";
import {DatatableRow} from "@/common/components/datatable/DatatableRow";
import {DatatableValue} from "@/common/components/datatable/DatatableValue";
import Label from "@/common/components/atomic/Label";
import {jobLevels} from "@/common/utils/statics";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import employeeService from "@/domain/employees/services/EmployeeService";
import {ArrayElement} from "@/common/utils/types";

interface Props {
    employees: Awaited<ReturnType<typeof employeeService.getAll>>
    onClick: (employee: ArrayElement<Awaited<ReturnType<typeof employeeService.getAll>>>) => void
    onUpdate: (employee: ArrayElement<Awaited<ReturnType<typeof employeeService.getAll>>>) => void
}

const EmployeeTable: FC<Props> = ({employees, onUpdate, onClick}) => {
    const {confirmation} = useStaticValues()
    return (
        <Datatable
            isEmpty={employees.length === 0}
            headers={['Photo', 'Prenom', 'Nom', 'Departement', 'Poste', 'Immatricule']}
        >
            {employees.map((employee) => (
                <DatatableRow
                    key={employee.id}
                    onClick={() => onClick(employee)}
                    onUpdate={() => onUpdate(employee)}
                    onDelete={{
                        action: '/api/employees/delete',
                        resourceId: employee.id,
                        message: confirmation.areYouSure
                    }}
                    actionButtons={
                        <ConfirmableActionButton
                            action='/api/employees/reset-password'
                            resourceId={employee.id}
                            template={{icon: 'ArrowPathIcon', text: 'Reinitialiser'}}
                            message="Le mot de passe sera réinitialisé et un email sera envoyé à l'adresse du salarié concerné."
                            tooltip='Réinitialisé le mot de passe du compte de ce salarié'
                        />
                    }
                >
                    <DatatableValue>
                        <ImagePreview imageRef={employee.photo}/>
                    </DatatableValue>
                    <DatatableValue>{employee.firstName}</DatatableValue>
                    <DatatableValue>{employee.lastName}</DatatableValue>
                    <DatatableValue><Label>{employee.department.title}</Label></DatatableValue>
                    <DatatableValue><Label>{jobLevels[employee.level]}</Label></DatatableValue>
                    <DatatableValue>{employee.registration}</DatatableValue>
                </DatatableRow>
            ))}
        </Datatable>
    );
}

export default EmployeeTable

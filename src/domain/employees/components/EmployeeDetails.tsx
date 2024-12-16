import {FC} from "react";
import {jobLevels} from "@/common/utils/statics";
import DetailsTable from "@/common/components/details-table/DetailsTable";
import DetailsRow from "@/common/components/details-table/DetailsRow";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import Link from "@/common/components/atomic/Link";
import Label from "@/common/components/atomic/Label";
import employeeService from "@/domain/employees/services/EmployeeService";
import {ArrayElement} from "@/common/utils/types";

interface Props {
    employee?: ArrayElement<Awaited<ReturnType<typeof employeeService.getAll>>>
}

const EmployeeDetails: FC<Props> = ({employee}) =>
    employee && (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-6 gap-8'>
                <ImagePreview imageRef={employee.photo} aspectRatio='aspect-square' width='w-full'/>
                <div className='col-span-5 flex flex-col gap-4'>
                    <div className='grid grid-cols-2 gap-8'>
                        <DetailsTable>
                            <DetailsRow title='Nom complet'>{`${employee.firstName} ${employee.lastName}`}</DetailsRow>
                            <DetailsRow title='Email'><Link
                                href={`mailto:${employee.user.email}`}>{employee.user.email}</Link></DetailsRow>
                            <DetailsRow title='Tel'>{employee.phone}</DetailsRow>
                        </DetailsTable>
                        <DetailsTable>
                            <DetailsRow title='Immatricule'>{employee.registration}</DetailsRow>
                            <DetailsRow title='Poste'><Label>{jobLevels[employee.level]}</Label></DetailsRow>
                            <DetailsRow title='Departement'><Label>{employee.department.title}</Label></DetailsRow>
                        </DetailsTable>
                    </div>
                </div>
            </div>
        </div>

    )

export default EmployeeDetails
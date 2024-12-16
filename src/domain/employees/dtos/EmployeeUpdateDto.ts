import {EmployeeCreateDto, EmployeeCreateFilesDto} from "@/domain/employees/dtos/EmployeeCreateDto";

export interface EmployeeUpdateDto extends Omit<EmployeeCreateDto, 'email'> {
    employeeId: string
    imageRef: string
}

export interface EmployeeUpdateFilesDto extends Partial<EmployeeCreateFilesDto> {
}
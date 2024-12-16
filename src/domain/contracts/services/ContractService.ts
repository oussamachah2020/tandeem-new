import {ContractUpdateDto, EditContractFilesDto} from "@/domain/contracts/dtos/ContractUpdateDto";
import fileService from "@/common/services/FileService";
import prisma from "@/common/libs/prisma";
import staticValues from "@/common/context/StaticValues";

class ContractService {
    getAll = async () =>
        await prisma
            .contract
            .findMany({
                include: {
                    partner: true,
                    customer: true
                }
            })

    updateOne = async (contractDto: ContractUpdateDto & EditContractFilesDto): Promise<keyof typeof staticValues.notification> => {
        if (contractDto.scan) fileService.replace(contractDto.scanRef, contractDto.scan).then()

        await prisma
            .contract
            .update({
                where: {
                    id: contractDto.id
                },
                data: {
                    from: new Date(contractDto.from),
                    to: new Date(contractDto.to),
                    prematureTo: contractDto.prematureTo ? new Date(contractDto.prematureTo) : null
                }
            })

        return 'contractUpdatedSuccess'
    }
}

let contractService: ContractService;

if (process.env.NODE_ENV === 'production') contractService = new ContractService();
else {
    if (!global.contractService) global.contractService = new ContractService();
    contractService = global.contractService;
}
export default contractService;
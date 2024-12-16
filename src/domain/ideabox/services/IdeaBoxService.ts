import prisma from "@/common/libs/prisma";
import staticValues from "@/common/context/StaticValues";
import { Prisma } from "@prisma/client";
import SortOrder = Prisma.SortOrder;

class IdeaBoxService {
    getAll = async (customerId: string) => {
        return prisma
            .ideaBox
            .findMany({
                where: {employee: {customerId}, archived: false},
                include: {employee: true},
                orderBy: {createdAt: SortOrder.desc}
            });
    };

    async archiveOne(ideaDto: { id: string, customerId?: string }): Promise<keyof typeof staticValues.notification> {
        const {id, customerId} = ideaDto
        const idea = await prisma.ideaBox.findUnique({where: {id, employee: {customerId: customerId ?? ' '}}})
        if (idea) {
            await prisma.ideaBox.update({where: {id}, data: {archived: true}});
            return 'ideaArchivedSuccess'
        }
        return 'deleteActionNotPermitted'
    }
}

let ideaBoxService: IdeaBoxService;

if (process.env.NODE_ENV === 'production') ideaBoxService = new IdeaBoxService();
else {
    if (!global.ideaBoxService) global.ideaBoxService = new IdeaBoxService();
    ideaBoxService = global.ideaBoxService;
}
export default ideaBoxService;

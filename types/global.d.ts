import {PrismaClient} from "@prisma/client";
import CustomerService from "@/domain/customers/services/CustomerService";
import AuthService from "@/common/services/AuthService";
import ContractService from "@/domain/contracts/services/ContractService";
import EmployeeService from "@/domain/employees/services/EmployeeService";
import FileService from "@/common/services/FileService";
import OfferService from "@/domain/offers/shared/services/OfferService";
import PartnerService from "@/domain/partners/services/PartnerService";
import MailService from "@/common/services/MailService";
import PublicationService from "@/domain/publications/services/PublicationService";
import AdminService from "@/domain/admins/services/AdminService";
import MediaLibraryService from "@/domain/media-library/services/MediaLibraryService";
import ideaBoxService from "@/domain/ideabox/services/IdeaBoxService";

declare global {
    var prisma: PrismaClient
    var authService: AuthService
    var contractService: ContractService
    var customerService: CustomerService
    var employeeService: EmployeeService
    var fileService: FileService
    var offerService: OfferService
    var partnerService: PartnerService
    var publicationService: PublicationService
    var adminService: AdminService
    var mailService: MailService
    var mediaLibraryService: MediaLibraryService
    var ideaBoxService: ideaBoxService
}
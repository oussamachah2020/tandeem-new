import {Role} from "@prisma/client";
import * as Icons from '@heroicons/react/24/outline'

export interface Section {
    name: SectionName
    href: string
    icon: keyof typeof Icons
    authorizedRoles: Role[],
    showInSidebar: boolean
}

export enum SectionName {
    Dashboard = 'Tableau de bord',
    Admins = 'Administrateurs',
    Customers = 'Sociétés Clientes',
    Partners = 'Partenaires',
    Publications = 'Publications',
    MediaLibrary = 'Médiathèque',
    Contracts = 'Contrats',
    Employees = 'Salariés',
    Offers = 'Offres',
    IdeaBox = 'Boîte à idées',
    Profile = 'Profile',
}

export const SECTIONS: Section[] = [
    {
        name: SectionName.Dashboard,
        href: "/dashboard",
        icon: 'RectangleGroupIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
        showInSidebar: true
    },
    {
        name: SectionName.Admins,
        href: "/admins",
        icon: 'UsersIcon',
        authorizedRoles: [Role.TANDEEM, Role.CUSTOMER],
        showInSidebar: true
    },
    {
        name: SectionName.Customers,
        href: "/customers",
        icon: 'BuildingOfficeIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2],
        showInSidebar: true
    },
    {
        name: SectionName.Partners,
        href: "/partners",
        icon: 'BriefcaseIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2],
        showInSidebar: true
    },
    {
        name: SectionName.Employees,
        href: "/employees",
        icon: 'UserGroupIcon',
        authorizedRoles: [Role.CUSTOMER, Role.CUSTOMER2],
        showInSidebar: true
    },
    {
        name: SectionName.Offers,
        href: "/offers",
        icon: 'ReceiptPercentIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
        showInSidebar: true
    },
    {
        name: SectionName.Publications,
        href: "/publications",
        icon: 'NewspaperIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
        showInSidebar: true
    },
    {
        name: SectionName.MediaLibrary,
        href: "/media-library",
        icon: 'RectangleStackIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
        showInSidebar: true
    },
    {
        name: SectionName.Contracts,
        href: "/contracts",
        icon: 'DocumentTextIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2],
        showInSidebar: true

    },
    {
        name: SectionName.IdeaBox,
        href: "/idea-box",
        icon: 'LightBulbIcon',
        authorizedRoles: [Role.CUSTOMER, Role.CUSTOMER2],
        showInSidebar: true
    },
    {
        name: SectionName.Profile,
        href: "/profile",
        icon: 'LightBulbIcon',
        authorizedRoles: [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
        showInSidebar: false
    }
]
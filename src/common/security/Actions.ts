import {Role} from "@prisma/client";

export type Action = Record<string, Role[]>


const CUSTOMER_ACTIONS: Action = {
    "create": [Role.TANDEEM, Role.TANDEEM2],
    "update": [Role.TANDEEM, Role.TANDEEM2],
    "delete": [Role.TANDEEM, Role.TANDEEM2],
}


const PARTNER_ACTIONS: Action = {
    "create": [Role.TANDEEM, Role.TANDEEM2],
    "update": [Role.TANDEEM, Role.TANDEEM2],
    "delete": [Role.TANDEEM, Role.TANDEEM2],
}


const OFFER_ACTIONS: Action = {
    "create": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
    "update": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
    "delete": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
    "accept": [Role.CUSTOMER, Role.CUSTOMER2],
    "unaccept": [Role.CUSTOMER, Role.CUSTOMER2],
    "activation": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2]
}


const CONTRACT_ACTIONS: Action = {
    "update": [Role.TANDEEM, Role.TANDEEM2]
}


const PUBLICATION_ACTIONS: Action = {
    "create": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
    "update": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
    "delete": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2]
}


const ADMIN_ACTIONS: Action = {
    "create": [Role.TANDEEM, Role.CUSTOMER],
    "update": [Role.TANDEEM, Role.CUSTOMER],
    "delete": [Role.TANDEEM, Role.CUSTOMER],
    "reactivate": [Role.TANDEEM, Role.CUSTOMER],
    "suspend": [Role.TANDEEM, Role.CUSTOMER],
    "reset-password": [Role.TANDEEM, Role.CUSTOMER]
}


const EMPLOYEE_ACTIONS: Action = {
    "create": [Role.CUSTOMER, Role.CUSTOMER2],
    "update": [Role.CUSTOMER, Role.CUSTOMER2],
    "delete": [Role.CUSTOMER, Role.CUSTOMER2],
    "reset-password": [Role.CUSTOMER, Role.CUSTOMER2]
}


const MEDIA_LIBRARY_ACTIONS: Action = {
    "create": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
    "update": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
    "delete": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2]
}


const IDEA_BOX_ACTIONS: Action = {
    "archive": [Role.CUSTOMER, Role.CUSTOMER2],
}

const VALIDATION_ACTIONS: Action = {
    "email": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
}

const SECURITY_ACTIONS: Action = {
    "update-password": [Role.TANDEEM, Role.TANDEEM2, Role.CUSTOMER, Role.CUSTOMER2],
}

export const ACTIONS: Record<string, Action> = {
    'customers': CUSTOMER_ACTIONS,
    'partners': PARTNER_ACTIONS,
    'offers': OFFER_ACTIONS,
    'contracts': CONTRACT_ACTIONS,
    'publications': PUBLICATION_ACTIONS,
    'admins': ADMIN_ACTIONS,
    'employees': EMPLOYEE_ACTIONS,
    'media-library': MEDIA_LIBRARY_ACTIONS,
    'idea-box': IDEA_BOX_ACTIONS,
    'validation': VALIDATION_ACTIONS,
    'security': SECURITY_ACTIONS
}

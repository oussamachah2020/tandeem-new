import {Blob} from "buffer";
import * as crypto from "crypto";
import {Category, Role, SubCategory} from "@prisma/client";

export const formatDate = (date: Date) => new Date(date).toLocaleDateString('fr-fr')

export const toHtmlDate = (date?: Date | number | null) => date ? new Date(date).toLocaleDateString('en-CA') : undefined

export const formatPhoneNumber = (tel: string) => {
    if (tel.startsWith('+212')) return `+212 ${tel.at(4)} ${tel.substring(5).replace(/(.{2})/g, '$1 ')}`
    if (tel.startsWith('+33')) return `+33 ${tel.substring(3).replace(/(.{2})/g, '$1 ')}`
    if (tel.startsWith('0')) return tel.replace(/(.{2})/g, '$1 ')
};

export const formatUrl = (url: string) => url
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '');

export const getDownloadUrl = (ref?: string | null) => ref ? `/api/files/${ref}` : ''

export const md5Hash = (from: string) => crypto.createHash('md5').update(from).digest('hex');

export const getMulterFields = (fields: string[]) => fields.map(field => ({name: field, maxCount: 1}))

export const toBlob = (file?: Express.Multer.File) => file ? new Blob([file.buffer], {type: file.mimetype}) : undefined
export const getLabeledSubCategories = (labeledSubCategories: Record<SubCategory, string>, category?: Category) => Object.entries(labeledSubCategories).filter(([key]) => key.startsWith(category ?? Category.NA))
export const getAllSubCategories = (labeledSubCategories: Record<SubCategory, string>) => Object.entries(labeledSubCategories)

export const arrayUniqueByKey = <T>(array: T[], key: keyof T) => Array.from(new Map(array.map(item => [item[key], item])).values());

export const getRoleLevel = (role: Role) => [Role.TANDEEM, Role.TANDEEM2].includes(role as any)
    ? 1
    : [Role.CUSTOMER, Role.CUSTOMER2].includes(role as any)
        ? 2
        : 3
import {any, literal, nativeEnum, object, string} from "zod";
import {transformDate, validate} from "@/common/utils/validation";
import {Category, PaymentMethod} from "@prisma/client";

export const validatePartnerCreateForm = async (formData: FormData) =>
    await validate(
        formData,
        object({
            name: string()
                .min(1, {message: "Le nom est requis."}),
            address: string()
                .min(1, {message: "L'adresse est requise."}),
            website: string()
                .url({message: "Veuillez fournir une URL de site web valide."}),
            category: nativeEnum(Category, {
                invalid_type_error: "La catégorie n'est pas valide.",
                required_error: 'La catégorie est requise.'
            }),
            logo: any()
                .refine(
                    (file) => file instanceof File && (file as File).size > 0,
                    {message: "Un logo est requis."}
                ),
            accepts: nativeEnum(PaymentMethod, {
                invalid_type_error: "La méthode de paiement n'est pas valide.",
                required_error: 'La méthode de paiement est requise.'
            }),
            contractScan: any()
                .refine(
                    (file) => file instanceof File && (file as File).size > 0,
                    {message: "Un scan de contrat est requis."}
                ),
            contractFrom: string({required_error: 'La date de début est requise.'})
                .transform(transformDate),
            contractTo: string({required_error: 'La date de fin est requise.'})
                .transform(transformDate),
            representativeName: string()
                .min(1, {message: "Le nom du représentant est requis."}),
            representativePhone: string()
                .optional(),
            representativeEmail: string()
                .email({message: "Veuillez fournir une adresse email représentant qui est valide."})
                .or(literal('')),
        })
            .refine(
                ({contractTo: to, contractFrom: from}) => to && from && to.getTime() > from.getTime(),
                'La date de fin doit être supérieure à la date de début')
            .refine(
                ({representativePhone: phone, representativeEmail: email}) => phone || email,
                "Au moins l'email du représentant ou son numero de téléphone doit être présent.")
    )
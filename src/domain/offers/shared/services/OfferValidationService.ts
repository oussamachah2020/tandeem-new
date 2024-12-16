import {any, date, nativeEnum, number, object, preprocess, string} from "zod";
import {validate} from "@/common/utils/validation";
import {SubCategory} from "@prisma/client";

export const validateLevel1OfferCreateForm = async (formData: FormData) =>
    await validate(
        formData,
        object({
            title: string()
                .nonempty({message: "Le titre est requis."}),
            description: string()
                .nonempty({message: "La description est requise."}),
            contractorId: string({required_error: 'Le partenaire est requis.'})
                .nonempty({message: 'Le partenaire est requis.'})
                .uuid({message: "Le partenaire n'est pas valide."}),
            category: nativeEnum(SubCategory, {
                invalid_type_error: "La catégorie n'est pas valide.",
                required_error: 'La catégorie est requise.'
            }),
            from: preprocess(
                (value) => value ? new Date(value as string) : undefined,
                date({
                    required_error: 'La date de début est requise.',
                    invalid_type_error: "La date de début n'est pas valide."
                })
            ),
            to: preprocess(
                (value) => value ? new Date(value as string) : undefined,
                date({
                    required_error: 'La date de fin est requise.',
                    invalid_type_error: "La date de fin n'est pas valide."
                })
            ),
            discount: preprocess(
                (value) => value ? Number(value) : undefined,
                number().int().min(1).max(100).optional(),
            ),
            initialPrice: preprocess(
                (value) => value ? Number(value) : undefined,
                number().optional()
            ),
            finalPrice: preprocess(
                (value) => value ? Number(value) : undefined,
                number().optional()
            ),
            image: any()
                .refine(
                    (value) => value instanceof File && (value as File).size > 0,
                    {message: "L'image est requise."})
        })
            .refine(
                ({to, from}) => {
                    return to && from && to.getTime() > from.getTime();
                },
                'La date de fin doit être supérieure à la date de début.')
            .refine(
                ({discount, initialPrice, finalPrice}) =>
                    (initialPrice === undefined && finalPrice === undefined) ? !!discount : (!!initialPrice && !!finalPrice),
                'Vous devez spécifier soit une valeur de remise, soit un prix initial/prix final.'
            )
            .refine(
                ({initialPrice, finalPrice}) =>
                    (initialPrice !== undefined && finalPrice !== undefined) ? initialPrice > finalPrice : true,
                "Le prix final doit être inférieur au prix initial.")
    )
import {any, object, string} from "zod";
import {checkEmailForUniqueness, validate} from "@/common/utils/validation";

export const validateEmployeeCreateForm = async (formData: FormData) =>
    await validate(
        formData,
        object({
            firstName: string()
                .min(1, {message: "Le prenom est requis."}),
            lastName: string()
                .min(1, {message: "Le nom est requis."}),
            email: string()
                .email({message: "Veuillez fournir une adresse email valide."})
                .refine(checkEmailForUniqueness, "L'e-mail que vous avez saisi est déjà associé à un autre utilisateur de tandeem."),
            photo: any()
                .refine((value) => {
                    const file = value as File;
                    return file instanceof File && file.size > 0;
                }, {message: "Une photo est requise."}),
        })
    )
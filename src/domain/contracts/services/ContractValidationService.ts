import {any, object, string} from "zod";
import {checkEmailForUniqueness, checkFileSize, validate} from "@/common/utils/validation";

export const validateContractUpdateForm = async (formData: FormData) => {
    const messages = await validate(
        formData,
        object({
            email: string()
                .refine(
                    checkEmailForUniqueness,
                    "emailAlreadyExists"
                ),
            photo: any()
                .refine(
                    checkFileSize,
                    "photoTooLarge"
                )
        })
    );
    return messages.length ? messages[0] : null
}
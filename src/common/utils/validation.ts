import { date, RefinementCtx, ZodError, ZodIssueCode, ZodType } from "zod";

export const checkEmailForUniqueness = async (email: string) => {
    const response = await fetch('/api/validation/email', {
        method: 'POST',
        redirect: 'follow',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
    })
    if (response.redirected) {
        window.location.href = "/login";
        return false;
    }
    return !!(await response.json());
}

export const checkFileSize = (value: any) => value instanceof File && (value as File).size <= 1024 * 1024
export const checkPasswordStrength = (password: string) => {
    // Define your criteria for a modern password here
    // For example, at least 8 characters, with at least one uppercase letter, one lowercase letter, one digit, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export const transformDate = async (dateStr: string, ctx: RefinementCtx) => {
    const parts = dateStr.split('/');
    const value = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    if (await date().safeParseAsync(value)) return value;
    ctx.addIssue({
        code: ZodIssueCode.invalid_date,
        message: "La date n'est pas valide."
    });
};

export const validate = async (formData: FormData, schema: ZodType): Promise<string[]> => {
    const model: Record<string, any> = {};
    formData.forEach((value, key) => (model[key] = value));
    try {
        await schema.parseAsync(model);
    } catch (error) {
        if (error instanceof ZodError) {
            return error.errors.map((validationError) => validationError.message);
        } else {
            console.error(error)
            return ["Une erreur inconnue s'est produite!"]
        }
    }
    return []
}
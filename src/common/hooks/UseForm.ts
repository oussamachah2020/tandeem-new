import {FormEvent, useState} from "react";
import {useNotifications} from "@/common/context/NotificationsContext";

export type FormValidator = (formData: FormData) => Promise<string | undefined | null> | string | undefined | null
export const useForm = (validator: FormValidator): [boolean, (e: FormEvent<HTMLFormElement>) => any] => {
    const [loading, setLoading] = useState(false)
    const [, setNotification] = useNotifications()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formElement = (e.target as HTMLFormElement)
        setLoading(true)
        const errorKey = await validator(new FormData(formElement));
        setNotification(errorKey ?? null)
        if (errorKey) setLoading(false)
        else formElement.submit()
    }

    return [loading, handleSubmit]
}
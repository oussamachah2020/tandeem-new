import {FC, FormEvent, ReactNode, useMemo} from "react";
import {FormValidator, useForm} from "@/common/hooks/UseForm";
import Button from "@/common/components/atomic/Button";
import * as Icons from '@heroicons/react/24/outline'
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    validator?: FormValidator
    action: string
    multipart?: true
    children?: ReactNode
    template?: 'CREATE' | 'UPDATE' | 'DELETE' | { icon: keyof typeof Icons, text: string }
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void
    className?: string
}

const Form: FC<Props> = ({validator, action, onSubmit, multipart, template, className, children}) => {
    const {action: actionValues} = useStaticValues()
    const [loading, handleSubmit] = useForm(validator ?? (() => null))
    const {icon, text, color} = useMemo<{ icon: keyof typeof Icons, text: string, color: string }>(() => {
        if (template === 'CREATE') {
            return {
                icon: 'PlusIcon',
                text: actionValues.add,
                color: 'bg-secondary'
            }
        } else if (template === 'UPDATE') {
            return {
                icon: 'PencilSquareIcon',
                text: actionValues.update,
                color: 'bg-secondary'
            }
        } else if (template === 'DELETE') {
            return {
                icon: 'TrashIcon',
                text: actionValues.delete,
                color: 'bg-red-500'
            }
        } else if (template) {
            return {
                ...template,
                color: 'bg-secondary'
            }
        } else {
            return {
                icon: 'CubeIcon',
                color: '',
                text: ''
            }
        }
    }, [template, actionValues.add, actionValues.update, actionValues.delete])
    return (
        <>
            <form
                onSubmit={(e) => {
                    handleSubmit(e)
                    if (onSubmit) onSubmit(e)
                }}
                action={action}
                method='post'
                encType={multipart ? 'multipart/form-data' : undefined}
            >
                <div className='mb-6'>
                    <div className={className}>
                        {children}
                    </div>
                </div>
                {template && <Button icon={icon} text={text} color={color} loading={loading} fullWidth/>}
            </form>
        </>
    );
}

export default Form
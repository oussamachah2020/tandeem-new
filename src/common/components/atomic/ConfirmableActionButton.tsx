import {FC, ReactNode, useMemo, useState} from "react";
import ActionButton from "@/common/components/atomic/ActionButton";
import {Modal} from "@/common/components/global/Modal";
import * as Icons from '@heroicons/react/24/outline'
import {useStaticValues} from "@/common/context/StaticValuesContext";
import Form from "@/common/components/global/Form";

interface Props {
    message: ReactNode | string
    action: string
    resourceId: string
    resourceRefs?: string[]
    template: 'DELETE' | { icon: keyof typeof Icons, text: string }
    tooltip?: string
}

const ConfirmableActionButton: FC<Props> = ({action, template, tooltip, message, resourceId, resourceRefs}) => {
        const {confirmation} = useStaticValues()
        const [isConfirmationModalShown, setIsConfirmationModalShown] = useState(false)
        const {icon, hoverColor} = useMemo<{ icon: keyof typeof Icons, hoverColor: string }>(() => {
            return template === 'DELETE'
                ? {icon: 'TrashIcon', hoverColor: 'hover:bg-red-200'}
                : {...template, hoverColor: 'hover:bg-gray-200'}
        }, [template])
        return (
            <>
                <ActionButton
                    icon={icon}
                    hoverColor={hoverColor}
                    onClick={() => setIsConfirmationModalShown(true)}
                    tooltip={tooltip}
                />
                <Modal
                    title={confirmation.areYouSure}
                    isShown={isConfirmationModalShown}
                    onClose={() => setIsConfirmationModalShown(false)}
                    width='w-1/2'
                >
                    <div className='flex flex-col gap-4'>
                        <div className='text-[1rem] whitespace-pre-line leading-relaxed'>
                            {message}
                        </div>
                        <hr className='border-0 border-b'/>
                        <Form action={action} template={template}>
                            <input
                                name='id'
                                value={resourceId}
                                type='text'
                                className='hidden'
                            />
                            {resourceRefs?.map((ref, idx) => (
                                <input
                                    key={idx}
                                    name='refs'
                                    value={ref}
                                    className='hidden'
                                />
                            ))}
                        </Form>
                    </div>
                </Modal>
            </>
        );
    }
;

export default ConfirmableActionButton
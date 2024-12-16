import {Children, FC, ReactElement, ReactNode} from "react";
import ActionButton from "@/common/components/atomic/ActionButton";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";

interface Props {
    className?: string
    onClick?: () => void
    children?: ReactNode
    onUpdate?: () => void
    onDelete?: { resourceId: string, resourceRefs?: string[], action: string, message: string }
    actionButtons?: ReactNode
}

export const DatatableRow: FC<Props> = ({onClick, onUpdate, onDelete, children, actionButtons}) =>
    <tr className={onClick && 'cursor-pointer hover:bg-neutral-50 transition duration-200'} onClick={onClick}>
        {Children.map(children, child => (
            <td className={(child as ReactElement).props.className}>
                {(child as ReactElement).props.children}
            </td>))}
        {(onUpdate || onDelete || actionButtons) &&
            <td className='w-[1%] whitespace-nowrap pl-10'>
                <div className='flex gap-4 items-center justify-start'>
                    {actionButtons}
                    {onUpdate &&
                        <ActionButton icon='PencilSquareIcon' hoverColor='hover:bg-sky-200' onClick={onUpdate}/>}
                    {onDelete &&
                        <ConfirmableActionButton
                            action={onDelete.action}
                            resourceId={onDelete.resourceId}
                            resourceRefs={onDelete.resourceRefs}
                            message={onDelete.message}
                            template='DELETE'
                        />}
                </div>
            </td>}
    </tr>;

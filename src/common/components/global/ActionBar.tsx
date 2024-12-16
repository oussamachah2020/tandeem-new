import {Input} from "@/common/components/atomic/Input";
import {ChangeEvent, FC} from "react";
import Button from "@/common/components/atomic/Button";

interface Props {
    action?: {
        text: string,
        onClick: () => void
    }
    onSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const ActionBar: FC<Props> = ({action, onSearchInputChange}) =>
    <div className='flex justify-between items-center mb-6'>
        <Input onChange={onSearchInputChange} className='w-2/5 h-12' icon='MagnifyingGlassIcon'
               placeholder='Rechercher'/>
        {action && <Button color='bg-primary' icon='PlusIcon' text={action.text} onClick={action.onClick}/>}
    </div>

export default ActionBar
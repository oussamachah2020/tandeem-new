import {FC, ReactNode} from "react";
import {FunnelIcon} from "@heroicons/react/24/outline";

interface Props {
    children?: ReactNode
}

const FilterGroup: FC<Props> = ({children}) =>
    <div className='flex items-center gap-6 my-5 px-4 divide-x py-2.5 bg-white border rounded-lg'>
        <FunnelIcon className='w-6 h-6 text-primary'/>
        {children}
    </div>

export default FilterGroup
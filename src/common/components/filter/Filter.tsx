import {ChangeEventHandler, FC} from "react";
import * as Icons from "@heroicons/react/24/outline";


interface Props {
    label: string
    icon: keyof typeof Icons,
    values: [string, string][]
    onValueChange: ChangeEventHandler
}

const Filter: FC<Props> = ({label, icon, values, onValueChange}) => {
    const Icon = Icons[icon as keyof typeof Icons]
    return <div className='pl-4 flex items-center gap-3'>
        <label className='text-sm font-medium' htmlFor={label}>{label}</label>
        <div className='relative'>
            <div className='absolute flex items-center inset-y-0 left-0 pl-4'>
                <Icon className='w-5 h-5 transition-colors duration-200 text-primary'/>
            </div>
            <select
                id={label}
                className='w-full pl-10 px-5 py-2 text-sm border border-gray-200 rounded-lg bg-white max-w-fit focus:outline-none focus:ring-2 focus:ring-secondary transition duration-200 disabled:bg-gray-50'
                onChange={onValueChange}
            >
                <option value=''>Tout</option>
                {values.map(([key, value], idx) => <option key={idx} value={key}>{value}</option>)}
            </select>
        </div>
    </div>;
}

export default Filter